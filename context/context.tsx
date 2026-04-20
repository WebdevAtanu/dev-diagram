"use client";
import { createContext, useState } from "react";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            setTheme("dark");
        }
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
export default ThemeProvider;