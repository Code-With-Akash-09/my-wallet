import QueryClientProvider from "./query-Client";
import ThemeProvider from "./theme-Provider";

const RootProvider = ({ children }) => {
    return (
        <QueryClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
    );
};

export default RootProvider;
