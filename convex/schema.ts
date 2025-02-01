import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
  }).index("byClerkUserId", ["clerkUserId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("bySlug", ["slug"]),

  blogs: defineTable({
    blogId: v.string(),
    title: v.string(),
    description: v.string(),
    coverImage: v.string(),
    content: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    likes: v.number(),
    likedBy: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    comments: v.array(
      v.object({
        id: v.string(),
        userId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        userImage: v.optional(v.string()),
        comment: v.string(),
        timestamp: v.number(),
      })
    ),
  })
    .index("byUserId", ["userId"])
    .index("byBlogId", ["blogId"])
    .index("byCategory", ["category"]),
});
