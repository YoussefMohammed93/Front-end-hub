import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import { mutation, query } from "./_generated/server";

// Create a new resource
export const createResource = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const resourceId = uuidv4();

    const resourceRecord = {
      resourceId,
      title: args.title,
      content: args.content,
      userId: user._id,
      createdAt: Date.now(),
    };

    const resourceInsertId = await ctx.db.insert("resources", resourceRecord);
    const resource = await ctx.db.get(resourceInsertId);
    if (!resource) throw new Error("Failed to create resource");

    return resource;
  },
});

// Get user resource
export const getUserResource = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Assumes one resource per user.
    return await ctx.db
      .query("resources")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();
  },
});

// Get the resource
export const getResource = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    return await ctx.db
      .query("resources")
      .withIndex("byResourceId", (q) => q.eq("resourceId", resourceId))
      .unique();
  },
});

// Update an existing resource
export const updateResource = mutation({
  args: {
    resourceId: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const resource = await ctx.db
      .query("resources")
      .withIndex("byResourceId", (q) => q.eq("resourceId", args.resourceId))
      .unique();
    if (!resource) throw new Error("Resource not found");
    if (resource.userId !== user._id)
      throw new Error("Not authorized to update this resource");

    await ctx.db.patch(resource._id, {
      title: args.title,
      content: args.content,
    });

    return await ctx.db.get(resource._id);
  },
});

// Delete a resource
export const deleteResource = mutation({
  args: {
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const resource = await ctx.db
      .query("resources")
      .withIndex("byResourceId", (q) => q.eq("resourceId", args.resourceId))
      .unique();
    if (!resource) throw new Error("Resource not found");
    if (resource.userId !== user._id)
      throw new Error("Not authorized to delete this resource");

    await ctx.db.delete(resource._id);
    return { success: true };
  },
});
