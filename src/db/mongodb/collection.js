import clientPromise from "./client";

export async function getDb() {
    const client = await clientPromise;
    return client.db("myWallet");
}

export const usersColl = async () => {
    const db = await getDb();
    return db.collection("users");
};

export const sessionsColl = async () => {
    const db = await getDb();
    return db.collection("sessions");
};

export const rateLimitsColl = async () => {
    const db = await getDb();
    return db.collection("rateLimits");
};
