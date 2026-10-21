import { getDb } from "@/db/mongodb/collection";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const db = await getDb();

        await db.command({ ping: 1 });

        return NextResponse.json(
            {
                status: "ok",
                database: "connected",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error in health check:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during health check.",
            },
            { status: 500 },
        );
    }
};
