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

  blogs: defineTable({
    blogId: v.string(),
    title: v.string(),
    description: v.string(),
    coverImage: v.string(),
    content: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    likes: v.number(),
    comments: v.array(
      v.object({
        userId: v.string(),
        comment: v.string(),
        timestamp: v.number(),
      })
    ),
  })
    .index("byUserId", ["userId"])
    .index("byBlogId", ["blogId"]),
});
