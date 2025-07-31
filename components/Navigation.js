"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Button from "@/components/ui/Button";

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-rgb(var(--card))/80 backdrop-blur-md border-b border-rgb(var(--border)) z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rgb(var(--primary)) to-rgb(var(--accent)) rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <span className="font-bold text-xl text-rgb(var(--foreground))">
              DevStack
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-rgb(var(--secondary)) transition-colors"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <Button variant="ghost" size="md">
              Login
            </Button>
            <Button variant="primary" size="md">
              Dashboard
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-rgb(var(--secondary)) transition-colors"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-rgb(var(--secondary)) transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-rgb(var(--foreground)) transition-all ${
                    isMenuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-rgb(var(--foreground)) mt-1 transition-all ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-rgb(var(--foreground)) mt-1 transition-all ${
                    isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-rgb(var(--border))">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="md" className="justify-start">
                Login
              </Button>
              <Button variant="primary" size="md" className="justify-start">
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
