import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBlog = mutation({
  args: {
    blogId: v.string(),
    title: v.string(),
    description: v.string(),
    coverImage: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const newBlog = {
      ...args,
      userId: user.clerkUserId,
      createdAt: Date.now(),
      likes: 0,
      comments: [],
    };

    return await ctx.db.insert("blogs", newBlog);
  },
});

export const getRecentBlogs = query({
  handler: async (ctx) => {
    return await ctx.db.query("blogs").order("desc").take(5);
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");
    if (blog.userId !== identity.subject) throw new Error("Unauthorized");

    const { id, ...rest } = args;
    return await ctx.db.patch(id, rest);
  },
});

export const removeBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");
    if (blog.userId !== identity.subject) throw new Error("Unauthorized");

    return await ctx.db.delete(args.id);
  },
});

export const addLike = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    return await ctx.db.patch(args.id, {
      likes: (blog.likes || 0) + 1,
    });
  },
});

export const removeLike = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    return await ctx.db.patch(args.id, {
      likes: Math.max((blog.likes || 0) - 1, 0),
    });
  },
});

export const addComment = mutation({
  args: {
    id: v.id("blogs"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    const newComment = {
      userId: identity.subject,
      comment: args.comment,
      timestamp: Date.now(),
    };

    return await ctx.db.patch(args.id, {
      comments: [...(blog.comments || []), newComment],
    });
  },
});

export const removeComment = mutation({
  args: {
    id: v.id("blogs"),
    commentIdx: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    const comments = blog.comments || [];
    const comment = comments[args.commentIdx];

    if (!comment) throw new Error("Comment not found");
    if (
      comment.userId !== identity.subject &&
      blog.userId !== identity.subject
    ) {
      throw new Error("Unauthorized");
    }

    const newComments = comments.filter((_, idx) => idx !== args.commentIdx);
    return await ctx.db.patch(args.id, { comments: newComments });
  },
});
