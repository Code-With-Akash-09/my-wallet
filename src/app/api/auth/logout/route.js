import { destroyCurrentSession } from "@/lib/auth/auth-service";
import { isSameOriginRequest } from "@/lib/auth/same-origin";
import { NextResponse } from "next/server";

export async function POST(request) {
    if (!isSameOriginRequest(request)) {
        return NextResponse.json(
            { error: "Invalid request origin." },
            { status: 403 },
        );
    }

    try {
        await destroyCurrentSession();
        return NextResponse.json({ success: true });
    } catch {
        console.error("Logout failed.");
        return NextResponse.json(
            { error: "Unable to log out right now." },
            { status: 500 },
        );
    }
}
