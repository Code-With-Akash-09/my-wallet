import ThemeSwitcher from "@/components/atoms/themeSwicher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
    return (
        <div className="flex flex-1 items-center justify-center w-full">
            <ThemeSwitcher />
            <Button>
                <Link href={"/auth"}>Get Started</Link>
            </Button>
        </div>
    );
};

export default HomePage;
