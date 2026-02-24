import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Set typing state for the current user in a conversation.
 */
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query("typingStates")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const myTyping = existing.find((t) => t.userId === user._id);

    if (myTyping) {
      await ctx.db.patch(myTyping._id, {
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
    } else if (args.isTyping) {
      await ctx.db.insert("typingStates", {
        conversationId: args.conversationId,
        userId: user._id,
        isTyping: true,
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Get who is typing in a conversation (excluding the current user).
 */
export const getTyping = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    const typingStates = await ctx.db
      .query("typingStates")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const now = Date.now();
    const TYPING_TIMEOUT = 3000;

    const activeTypers = [];
    for (const t of typingStates) {
      if (t.userId === user._id) continue;
      if (!t.isTyping) continue;
      if (now - t.updatedAt > TYPING_TIMEOUT) continue;

      const typer = await ctx.db.get(t.userId);
      if (typer) {
        activeTypers.push(typer.name || "Someone");
      }
    }

    return activeTypers;
  },
});
