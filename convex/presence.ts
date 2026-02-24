import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ONLINE_THRESHOLD_MS = 60_000; // 1 minute

/**
 * Heartbeat: call this periodically to mark the user as online.
 */
export const heartbeat = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSeen: Date.now(),
        isOnline: true,
      });
    } else {
      await ctx.db.insert("presence", {
        userId: user._id,
        lastSeen: Date.now(),
        isOnline: true,
      });
    }
  },
});

/**
 * Returns a map of userId -> isOnline for all users.
 */
export const getPresence = query({
  args: {},
  handler: async (ctx) => {
    const allPresence = await ctx.db.query("presence").collect();
    const now = Date.now();

    const result: Record<string, boolean> = {};
    for (const p of allPresence) {
      result[p.userId] = now - p.lastSeen < ONLINE_THRESHOLD_MS;
    }
    return result;
  },
});
