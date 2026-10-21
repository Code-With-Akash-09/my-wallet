import "server-only";

import { createHash } from "node:crypto";
import { getAuthCollections } from "./auth-db";

function hashKey(value) {
    return createHash("sha256").update(value).digest("hex");
}

export async function consumeRateLimit({ scope, identity, limit, windowMs }) {
    const now = Date.now();
    const bucket = Math.floor(now / windowMs);
    const expiresAt = new Date((bucket + 1) * windowMs);

    const id = `${scope}:${hashKey(identity)}:${bucket}`;
    const { rateLimits } = await getAuthCollections();

    await rateLimits.updateOne(
        { _id: id },
        {
            $inc: { count: 1 },
            $setOnInsert: { expiresAt },
        },
        { upsert: true },
    );

    const record = await rateLimits.findOne(
        { _id: id },
        { projection: { count: 1 } },
    );

    return (record?.count ?? limit + 1) <= limit;
}
