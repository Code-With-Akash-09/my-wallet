import {
    rateLimitsColl,
    sessionsColl,
    usersColl,
} from "@/db/mongodb/collection";

let indexesPromise;

export const getAuthCollections = async () => {
    const users = await usersColl();
    const sessions = await sessionsColl();
    const rateLimits = await rateLimitsColl();

    if (!indexesPromise) {
        indexesPromise = Promise.all([
            users.createIndex(
                { email: 1 },
                {
                    unique: true,
                    name: "unique_user_email",
                },
            ),
            sessions.createIndex(
                { tokenHash: 1 },
                {
                    unique: true,
                    name: "unique_session_token_hash",
                },
            ),
            sessions.createIndex(
                { expiresAt: 1 },
                {
                    expireAfterSeconds: 0,
                    name: "session_expiration",
                },
            ),
            rateLimits.createIndex(
                { expiresAt: 1 },
                {
                    expireAfterSeconds: 0,
                    name: "rate_limit_expiration",
                },
            ),
        ]).then(() => undefined);
    }

    try {
        await indexesPromise;
    } catch (error) {
        indexesPromise = undefined;
        throw error;
    }

    return { users, sessions, rateLimits };
};
