import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    workouts: defineTable({
        userId: v.string(),
        title: v.string(),
        detail: v.optional(v.string()),
    }).index("by_userId", ["userId"]),
});
