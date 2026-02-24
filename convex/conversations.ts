import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Creates a new direct message conversation or returns an existing one.
 */
export const createOrGetDirectConversation = mutation({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Find the current user in our DB
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    if (currentUser._id === args.otherUserId) {
        throw new Error("Cannot chat with yourself");
    }

    // Check if a conversation already exists between these two users
    const existingConversation = await ctx.db
      .query("conversationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    // This is a bit inefficient (N+1), but fine for MVP.
    // We iterate through all conversations the current user is in,
    // and check if the other user is also a member.
    for (const member of existingConversation) {
      const conversation = await ctx.db.get(member.conversationId);
      if (conversation?.isGroup) continue;

      const otherMember = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversationId_userId", (q) =>
          q.eq("conversationId", member.conversationId).eq("userId", args.otherUserId)
        )
        .unique();

      if (otherMember) {
        return conversation!._id;
      }
    }

    // No existing conversation found, create a new one
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: Date.now(),
    });

    // Add both members
    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: currentUser._id,
      joinedAt: Date.now(),
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: args.otherUserId,
      joinedAt: Date.now(),
    });

    return conversationId;
  },
});

/**
 * Lists all conversations for the current user.
 * Returns the conversation details + the other user's info (for DMs).
 */
export const getMyConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      memberships.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) return null;

        // For DMs, we need to fetch the OTHER user's info to display name/avatar
        let otherUser = null;
        if (!conversation.isGroup) {
          const members = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
            .collect();
            
          const otherMembership = members.find((m) => m.userId !== currentUser._id);
          
          if (otherMembership) {
            otherUser = await ctx.db.get(otherMembership.userId);
          }
        }

        // Fetch the last message for preview
        const lastMessage = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
            .order("desc")
            .first();

        // Count unread messages
        const lastReadAt = membership.lastReadAt || 0;
        const allMessages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
            .collect();
        const unreadCount = allMessages.filter(
            (m) => m.createdAt > lastReadAt && m.senderId !== currentUser._id
        ).length;

        return {
          ...conversation,
          otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Filter out nulls and sort by last message time (or creation time)
    return conversations
        .filter((c) => c !== null)
        .sort((a, b) => {
            const timeA = a?.lastMessage?.createdAt || a?.createdAt || 0;
            const timeB = b?.lastMessage?.createdAt || b?.createdAt || 0;
            return timeB - timeA;
        });
  },
});

/**
 * Marks a conversation as read by updating lastReadAt.
 */
export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return;

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId_userId", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
      )
      .unique();

    if (membership) {
      await ctx.db.patch(membership._id, {
        lastReadAt: Date.now(),
      });
    }
  },
});
