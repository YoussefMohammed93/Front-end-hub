import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import { mutation, query } from "./_generated/server";

// Create a new document
export const createDoc = mutation({
  args: {
    title: v.string(),
    category: v.string(),
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

    const docId = uuidv4();

    const documentId = await ctx.db.insert("docs", {
      docId,
      title: args.title,
      category: args.category,
      content: args.content,
      userId: user._id,
      createdAt: Date.now(),
    });

    const doc = await ctx.db.get(documentId);

    if (!doc) throw new Error("Failed to create document");

    return doc;
  },
});

// Get all documents
export const getAllDocs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("docs").collect();
  },
});

// Get a document by ID
export const getDoc = query({
  args: {
    docId: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("docs")
      .withIndex("byDocId", (q) => q.eq("docId", args.docId))
      .unique();

    if (!doc) return null;

    const userId = ctx.db.normalizeId("users", doc.userId);

    const user = userId ? await ctx.db.get(userId) : null;

    return { ...doc, user };
  },
});

// Get documents by category
export const getDocsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("docs")
      .withIndex("byCategory", (q) => q.eq("category", args.category))
      .collect();
    return docs;
  },
});

// Update an existing document
export const updateDoc = mutation({
  args: {
    docId: v.string(),
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

    const doc = await ctx.db
      .query("docs")
      .withIndex("byDocId", (q) => q.eq("docId", args.docId))
      .unique();

    if (!doc) throw new Error("Document not found");

    if (doc.userId !== user._id)
      throw new Error("Not authorized to update this document");

    await ctx.db.patch(doc._id, {
      title: args.title,
      content: args.content,
    });

    return await ctx.db.get(doc._id);
  },
});

// Delete an existing document
export const deleteDoc = mutation({
  args: {
    docId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const doc = await ctx.db
      .query("docs")
      .withIndex("byDocId", (q) => q.eq("docId", args.docId))
      .unique();

    if (!doc) throw new Error("Document not found");

    if (doc.userId !== user._id)
      throw new Error("Not authorized to delete this document");

    await ctx.db.delete(doc._id);

    return { success: true };
  },
});
