"use client";

export const fetchClient = async (endpoint, options = {}) => {
    const resp = await fetch(endpoint, {
        ...options,
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    return resp.json();
};
