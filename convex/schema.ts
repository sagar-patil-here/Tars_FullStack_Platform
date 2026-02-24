import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table: synced from Clerk
  users: defineTable({
    clerkId: v.string(),      // The Clerk user ID (e.g., "user_2n...")
    email: v.string(),        // User's email address
    name: v.optional(v.string()), // User's full name
    image: v.optional(v.string()), // URL to avatar image
    createdAt: v.number(),    // Timestamp
  })
  .index("by_clerkId", ["clerkId"]) // Fast lookup by Clerk ID
  .index("by_email", ["email"]),    // Fast lookup by email

  // Conversations table
  conversations: defineTable({
    isGroup: v.boolean(),
    name: v.optional(v.string()), // Only for group chats
    createdAt: v.number(),
  }),

  // Link table: Users <-> Conversations
  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    joinedAt: v.number(),
    lastReadAt: v.optional(v.number()), // Tracks when the user last read this conversation
  })
  .index("by_conversationId", ["conversationId"])
  .index("by_userId", ["userId"])
  .index("by_conversationId_userId", ["conversationId", "userId"]),

  // Messages table
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
  .index("by_conversationId", ["conversationId"]), // Fetch messages for a chat

  // Presence table: Who is online?
  presence: defineTable({
    userId: v.id("users"),
    lastSeen: v.number(),
    isOnline: v.boolean(),
  })
  .index("by_userId", ["userId"]),

  // Typing indicators
  typingStates: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    updatedAt: v.number(),
  })
  .index("by_conversationId", ["conversationId"]),
});
