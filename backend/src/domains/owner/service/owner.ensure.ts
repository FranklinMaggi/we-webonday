    import { Env } from "types/env";
    import { OWNER_KEY } from "../keys";
    import { OwnerSchema } from "../schema/owner.schema";

    export async function ensureOwner(
    env: Env,
    userId: string
    ) {
    const key = OWNER_KEY(userId);
    const existing = await env.BUSINESS_KV.get(key, "json");

    if (existing) return existing;

    const now = new Date().toISOString();

    const owner = OwnerSchema.parse({
        verification: "DRAFT" ,
        ownerDataComplete: false,
            id: userId,
        userId,
        createdAt: now,
        updatedAt: now,
    });

    await env.BUSINESS_KV.put(key, JSON.stringify(owner));

    return owner;
    }


