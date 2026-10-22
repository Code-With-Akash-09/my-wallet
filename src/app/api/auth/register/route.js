import { usersColl } from "@/db/mongodb/collection";
import { createSession, hashAccountPassword } from "@/lib/auth/auth-service";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { REGISTER_FORM_SCHEMA } from "@/schemas/auth";
import { nanoid } from "nanoid";
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
            scope: "register",
            identity: ip,
            limit: 5,
            windowMs: 60 * 60 * 1000,
        });

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many registration attempts. Try again later." },
                { status: 429 },
            );
        }

        const body = await request.json();
        const parsed = REGISTER_FORM_SCHEMA.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid input." },
                { status: 400 },
            );
        }

        const users_coll = await usersColl();
        const { name, email, mobile, password } = parsed.data;

        const existingUser = await users_coll.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: "An account with this email or mobile already exists.",
                },
                { status: 409 },
            );
        }

        const passwordHash = await hashAccountPassword(password);

        const data = {
            userId: nanoid(12),
            name,
            email,
            mobile,
            password: passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await users_coll.insertOne(data);

        await createSession(data.userId);

        return NextResponse.json(
            { success: true, message: "Account created successfully." },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration failed.");
        return NextResponse.json(
            { error: "Unable to create your account right now." },
            { status: 500 },
        );
    }
};
