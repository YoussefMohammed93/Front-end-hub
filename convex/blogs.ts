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
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    let categoryEntry = await ctx.db
      .query("categories")
      .withIndex("bySlug", (q) => q.eq("slug", args.category))
      .unique();

    if (!categoryEntry) {
      const newCategory = {
        name: args.category.toUpperCase(),
        slug: args.category,
        createdAt: Date.now(),
      };
      const newCategoryId = await ctx.db.insert("categories", newCategory);
      categoryEntry = await ctx.db.get(newCategoryId);
    }

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
      category: args.category,
      comments: [],
    });

    const blog = await ctx.db.get(documentId);
    if (!blog) throw new Error("Failed to create blog");

    return blog;
  },
});

// Get all blogs
export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogs").collect();
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

// Get blogs by category
export const getBlogsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("byCategory", (q) => q.eq("category", args.category))
      .collect();

    return blogs;
  },
});

// Like , Unlike blog
export const toggleLike = mutation({
  args: {
    blogId: v.string(),
    liked: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const userId = identity.subject;

    const blog = await ctx.db
      .query("blogs")
      .withIndex("byBlogId", (q) => q.eq("blogId", args.blogId))
      .unique();

    if (!blog) throw new Error("Blog not found");

    const likedBy: string[] = blog.likedBy || [];
    const hasLiked = likedBy.includes(userId);

    let newLikes = blog.likes;

    if (args.liked) {
      if (hasLiked) return blog.likes;
      likedBy.push(userId);
      newLikes = blog.likes + 1;
    } else {
      if (!hasLiked) return blog.likes;
      const updatedLikedBy = likedBy.filter((id) => id !== userId);
      newLikes = blog.likes - 1;

      await ctx.db.patch(blog._id, {
        likedBy: updatedLikedBy,
        likes: newLikes,
      });

      return newLikes;
    }
    await ctx.db.patch(blog._id, { likedBy, likes: newLikes });

    return newLikes;
  },
});

// Add comment to blog
export const addComment = mutation({
  args: {
    blogId: v.string(),
    comment: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const blog = await ctx.db
      .query("blogs")
      .withIndex("byBlogId", (q) => q.eq("blogId", args.blogId))
      .unique();

    if (!blog) throw new Error("Blog not found");

    const newComment = {
      id: uuidv4(),
      userId: identity.subject,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userImage: user.imageUrl || "",
      comment: args.comment,
      timestamp: args.timestamp,
    };

    await ctx.db.patch(blog._id, {
      comments: blog.comments.concat(newComment),
    });

    return newComment;
  },
});

// Delete comment from blog
export const deleteComment = mutation({
  args: {
    blogId: v.string(),
    commentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const blog = await ctx.db
      .query("blogs")
      .withIndex("byBlogId", (q) => q.eq("blogId", args.blogId))
      .unique();

    if (!blog) throw new Error("Blog not found");

    const commentToDelete = blog.comments.find(
      (comment) => comment.id === args.commentId
    );

    if (!commentToDelete) throw new Error("Comment not found");

    if (commentToDelete.userId !== identity.subject) {
      throw new Error("Unauthorized: You can only delete your own comments");
    }

    const newComments = blog.comments.filter(
      (comment) => comment.id !== args.commentId
    );

    await ctx.db.patch(blog._id, { comments: newComments });
    return { success: true };
  },
});
