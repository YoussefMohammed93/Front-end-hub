import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import { mutation, query } from "./_generated/server";

// Create a new blog
export const createBlog = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    coverImage: v.string(),
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

    const blogId = uuidv4();

    const documentId = await ctx.db.insert("blogs", {
      blogId,
      title: args.title,
      description: args.description,
      coverImage: args.coverImage,
      content: args.content,
      userId: user._id,
      createdAt: Date.now(),
      likes: 0,
      comments: [],
    });

    const blog = await ctx.db.get(documentId);
    if (!blog) throw new Error("Failed to create blog");

    return blog;
  },
});

// Get a blog by ID
export const getBlog = query({
  args: {
    blogId: v.string(),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("byBlogId", (q) => q.eq("blogId", args.blogId))
      .unique();

    if (!blog) throw new Error("Blog not found");

    return blog;
  },
});

// Get the most recent blogs
export const getRecentBlogs = query({
  handler: async (ctx) => {
    return await ctx.db.query("blogs").order("desc").take(5);
  },
});

// Update a blog
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
    await ctx.db.patch(id, rest);
    return await ctx.db.get(id);
  },
});

// Remove a blog
export const removeBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    if (blog.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Add a like to a blog
export const addLike = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    await ctx.db.patch(args.id, {
      likes: (blog.likes || 0) + 1,
    });

    return await ctx.db.get(args.id);
  },
});

// Remove a like from a blog
export const removeLike = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");

    await ctx.db.patch(args.id, {
      likes: Math.max((blog.likes || 0) - 1, 0),
    });

    return await ctx.db.get(args.id);
  },
});

// Add a comment to a blog
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

    await ctx.db.patch(args.id, {
      comments: [...(blog.comments || []), newComment],
    });

    return await ctx.db.get(args.id);
  },
});

// Remove a comment from a blog
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
    await ctx.db.patch(args.id, { comments: newComments });

    return await ctx.db.get(args.id);
  },
});
