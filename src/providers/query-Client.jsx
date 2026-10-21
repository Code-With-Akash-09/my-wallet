"use client";

import { queryClient } from "@/service/queryClient";
import { QueryClientProvider as QCProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const QueryClientProvider = ({ children }) => {
    return (
        <QCProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QCProvider>
    );
};

export default QueryClientProvider;
