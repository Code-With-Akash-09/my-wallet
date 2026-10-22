import AuthGuard from "@/components/organism/authGuard";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const Authenticatedlayout = ({ children }) => {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center flex-1 w-full">
                    <Spinner className={"size-8"} />
                </div>
            }
        >
            <AuthGuard>{children}</AuthGuard>
        </Suspense>
    );
};

export default Authenticatedlayout;
