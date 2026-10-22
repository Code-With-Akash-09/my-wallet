import "server-only";

import argon2 from "argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createHash, randomBytes } from "node:crypto";

import { getAuthCollections } from "@/lib/auth/auth-db";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const COOKIE_NAME =
    process.env.NODE_ENV === "production"
        ? "__Host-vaultly_session"
        : "vaultly_session";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export async function hashAccountPassword(password) {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });
}

export async function verifyAccountPassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

export async function createSession(userId) {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + SESSION_DURATION_MS);

    const { sessions } = await getAuthCollections();

    await sessions.insertOne({
        userId,
        tokenHash,
        createdAt,
        expiresAt,
    });

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        ...COOKIE_OPTIONS,
        expires: expiresAt,
    });
}

export async function destroyCurrentSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token) {
        const { sessions } = await getAuthCollections();

        await sessions.deleteOne({
            tokenHash: hashToken(token),
        });
    }

    cookieStore.set(COOKIE_NAME, "", {
        ...COOKIE_OPTIONS,
        expires: new Date(0),
        maxAge: 0,
    });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    await connection();

    const { sessions, users } = await getAuthCollections();

    const session = await sessions.findOne({
        tokenHash: hashToken(token),
        expiresAt: { $gt: new Date() },
    });

    if (!session) return null;

    const user = await users.findOne({
        userId: session.userId,
    });

    if (!user) {
        await sessions.deleteOne({ _id: session._id });
        return null;
    }

    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
}

export async function requireUser() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth");
    }

    return user;
}
