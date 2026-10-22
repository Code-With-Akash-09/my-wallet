import { fetchClient } from "@/service/fetchClient";

export const register = async (body) => {
    return await fetchClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
    });
};

export const login = async (body) => {
    return await fetchClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
    });
};
