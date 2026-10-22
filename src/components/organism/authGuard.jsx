import { requireUser } from "@/lib/auth/auth-service";

export default async function AuthGuard({ children }) {
    await requireUser();
    return children;
}
