import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Syncs a Clerk user to the Convex database.
 * If the user exists, updates their profile.
 * If not, creates a new user record.
 */
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user in case they changed their name/image
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        image: args.image,
      });
      return existingUser._id;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      image: args.image,
      createdAt: Date.now(),
    });

    return newUserId;
  },
});

/**
 * Gets all users from the database.
 * Useful for the "New Chat" list.
 */
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

/**
 * Gets a single user by their Clerk ID.
 */
export const getUserByClerkId = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId as string))
      .unique();
  },
});
