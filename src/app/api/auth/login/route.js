import { usersColl } from "@/db/mongodb/collection";
import { createSession, verifyAccountPassword } from "@/lib/auth/auth-service";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { LOGIN_FORM_SCHEMA } from "@/schemas/auth";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    if (!isSameOriginRequest(request)) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid request origin.",
            },
            { status: 403 },
        );
    }
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";

    try {
        const allowed = await consumeRateLimit({
            scope: "login-ip",
            identity: ip,
            limit: 20,
            windowMs: 15 * 60 * 1000,
        });

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many login attempts. Try again later." },
                { status: 429 },
            );
        }

        const body = await request.json();
        const parsed = LOGIN_FORM_SCHEMA.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid input." },
                { status: 400 },
            );
        }

        const { email, password } = parsed.data;

        const emailAllowed = await consumeRateLimit({
            scope: "login-email",
            identity: email,
            limit: 10,
            windowMs: 15 * 60 * 1000,
        });

        if (!emailAllowed) {
            return NextResponse.json(
                { error: "Too many login attempts. Try again later." },
                { status: 429 },
            );
        }

        const users_coll = await usersColl();

        const user = await users_coll.findOne({ email });
        const valid = user
            ? await verifyAccountPassword(user.password, password)
            : false;

        if (!user || !valid) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 },
            );
        }

        await createSession(user.userId);

        return NextResponse.json({
            user: {
                userId: user.userId,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login failed.", error);
        return NextResponse.json(
            { error: "Unable to login right now." },
            { status: 500 },
        );
    }
};
