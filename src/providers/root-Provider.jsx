import ThemeProvider from "./theme-Provider";

const RootProvider = ({ children }) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};

export default RootProvider;
