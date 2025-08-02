// components/Header.js
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* ‣ add / remove glass blur on scroll */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ‣ lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Blog", href: "#" },
    { name: "Profile", href: "#" },
  ];

  return (
    <div className="sticky top-0 z-50 backdrop-blur-3xl">
      <ScrollReveal>
        <header className="max-w-full">
          <nav
            className={`transition-all duration-500 ${
              isScrolled ? "glass-effect-green" : "glass-effect"
            }`}
          >
            <div className="container mx-auto flex items-center justify-between px-8 py-3">
              {/* logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-900 dark:text-white group"
              >
                <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <h1 className="text-2xl font-bold">
                    <Image
                      src="/linkgraphlogo.png"
                      width={100}
                      height={30}
                      alt="Linkgraph"
                    />
                  </h1>
                </div>
              </Link>

              {/* desktop nav */}
              <div className="hidden md:flex items-center space-x-4">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative group"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>

              {/* CTA & Theme Toggle */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="#"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                >
                  Sign In
                </Link>
                <button
                  aria-label="Toggle Dark Mode"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {mounted &&
                    (theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    ))}
                </button>
              </div>

              {/* mobile trigger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-gray-800 dark:text-gray-200 p-2 transition-all duration-300 hover:bg-green-500/10 rounded-lg"
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
              </button>
            </div>
          </nav>
        </header>
      </ScrollReveal>

      {/* mobile panel */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all backdrop-blur-2xl duration-500 ease-in-out ${
          isMenuOpen
            ? "opacity-100 visible backdrop-blur-2xl bg-black"
            : "opacity-0 invisible"
        }`}
      >
        <div className="">
          <div className="flex flex-col h-screen px-8 py-4 mx-auto bg-black">
            <div className="flex items-center justify-between ">
              <Link
                href="#"
                className="flex items-center space-x-2 text-gray-900 dark:text-white"
              >
                <Image
                  src="/linkgraphlogo.png"
                  width={100}
                  height={30}
                  alt="Linkgraph"
                />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 dark:text-gray-200 p-2 transition-all duration-300 hover:bg-green-500/10 rounded-lg"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
              </button>
            </div>

            <nav className="flex flex-col items-start space-y-6 mt-16 ">
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-2xl font-medium text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300 transform hover:translate-x-2 ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${i * 0.1}s` : "0s",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                aria-label="Toggle Dark Mode"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`flex items-center space-x-2 text-2xl font-medium text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300 transform hover:translate-x-2 ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${navLinks.length * 0.1}s`
                    : "0s",
                }}
              >
                <span>Toggle Theme</span>
                {mounted &&
                  (theme === "dark" ? (
                    <Sun className="h-6 w-6 ml-2" />
                  ) : (
                    <Moon className="h-6 w-6 ml-2" />
                  ))}
              </button>
            </nav>

            <Link
              href="#"
              className={`mt-auto w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold text-center px-4 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "0.4s" : "0s" }}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
