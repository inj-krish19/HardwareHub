"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the page paints (see app/layout.tsx), so the saved
// theme is applied with no flash. Light is the default when nothing is saved.
export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // The server cannot know the saved theme, so start as "light" and then read
    // the class the init script already put on <html>. This effect only READS;
    // it never writes to storage, so a saved choice is not overwritten on load.
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }, []);

    // Storage is written only when the person actually toggles.
    const toggle = useCallback(() => {
        const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            /* private mode or blocked storage: the theme still changes for this visit */
        }
        setTheme(next);
    }, []);

    return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}