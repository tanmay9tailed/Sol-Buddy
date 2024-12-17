import { useEffect, useState } from "react";

export const useThemeDetector = () => {
    const getCurrentTheme = () => localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const [theme, setTheme] = useState(getCurrentTheme);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); 
    };

    useEffect(() => {
        if (theme === "dark") {
            document.querySelector("html").classList.add("dark");
        } else {
            document.querySelector("html").classList.remove("dark");
        }
    }, [theme]); 
    return { theme, toggleTheme };
};
