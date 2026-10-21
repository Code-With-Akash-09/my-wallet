import { getCurrentUser } from "@/lib/auth/auth-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
        return NextResponse.json({ user });
    } catch {
        console.error("Current-user lookup failed.");
        return NextResponse.json(
            { error: "Unable to retrieve the current user." },
            { status: 500 },
        );
    }
}
