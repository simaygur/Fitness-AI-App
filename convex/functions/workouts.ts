import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Workout oluşturma
export const createWorkout = mutation({
    args: {
        title: v.string(),
        detail: v.optional(v.string()),
    },
    handler: async ({ db, auth }, { title, detail }) => {
        const identity = await auth.getUserIdentity();

        if (!identity) throw new Error("Not authenticated");

        return await db.insert("workouts", {
            userId: identity.tokenIdentifier,
            title,
            detail: detail || "",
        });
    },
});

// Workout listeleme (kullanıcıya göre)
export const getWorkouts = query({
    args: {},
    handler: async ({ db, auth }) => {
        const identity = await auth.getUserIdentity();
        if (!identity) return [];

        return await db
            .query("workouts")
            .withIndex("by_userId", q => q.eq("userId", identity.tokenIdentifier))
            .collect();
    },
});
