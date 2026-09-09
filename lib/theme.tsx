"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const stored = window.localStorage.getItem("hh-theme") as Theme | null;
        const initial =
            stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(initial);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        window.localStorage.setItem("hh-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{ theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}