import clientPromise from "./client";

export async function getDb() {
    const client = await clientPromise;
    return client.db("myWallet");
}
