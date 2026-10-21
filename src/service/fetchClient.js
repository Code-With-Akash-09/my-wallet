import { headers } from "next/headers";
import "server-only";

const baseUrl =
    process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:4013";

export const fetchClient = async (endpoint, options = {}) => {
    const headersList = await headers();
    const origin =
        headersList.get("origin") ?? headersList.get("referer");

    const resp = await fetch(`${baseUrl + endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(origin ? { origin } : {}),
            ...options.headers,
        },
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    return resp.json();
};
