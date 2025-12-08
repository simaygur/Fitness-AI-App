import { query } from "./_generated/server";

export const getIdentity = query(async ({ auth }) => {
    const identity = await auth.getUserIdentity();
    return identity;
});
