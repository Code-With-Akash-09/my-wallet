"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = ({
    text,
    size = "icon",
    variant = "outline",
    className,
    sidebar = false,
}) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Button
            size={size}
            variant={variant}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                className,
                sidebar &&
                    "shrink-0 gap-6.5! px-2.5 items-center group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2.5!",
            )}
        >
            {mounted ? (
                theme === "dark" ? (
                    <MoonStarIcon className="size-5" />
                ) : (
                    <SunIcon className="size-5" />
                )
            ) : (
                <Skeleton className="size-5" />
            )}
            {text && (
                <span
                    className={cn(
                        sidebar &&
                            "text-sm group-data-[collapsible=icon]:hidden",
                    )}
                >
                    {mounted ? (theme === "dark" ? "Dark" : "Light") : null}
                </span>
            )}
        </Button>
    );
};

export default ThemeSwitcher;
