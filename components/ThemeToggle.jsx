// components/ThemeToggle.jsx
"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-black border-4 border-green-400 hover:bg-green-400 hover:text-black text-green-400 retro-pulse pixel-text p-2"
      style={{ borderRadius: "0" }}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" strokeWidth={3} />
      ) : (
        <Sun className="h-5 w-5" strokeWidth={3} />
      )}
    </button>
  );
};

export default ThemeToggle;
