// components/Hero.jsx
"use client";

import { ArrowDown, Zap, Code2, Youtube, Twitter, Twitch } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();

  const scrollToQuiz = () => {
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black scanlines">
      {/* 8-bit pixelated grid background */}
      <div className="absolute inset-0 pixel-grid opacity-30"></div>

      {/* Floating pixels */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-4 h-4 bg-green-400 retro-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-4 h-4 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-4 h-4 bg-green-400 retro-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-60 right-1/3 w-4 h-4 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Moving scanline (green horizontal bar) */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-1 bg-green-400 opacity-50 animate-pulse"
            style={{ animation: "scanlines 3s linear infinite" }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Retro header with pixel art style */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="relative retro-pulse">
            <Code2 className="h-16 w-16 text-green-400" strokeWidth={3} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-green-400 pixel-text retro-flicker">
            LINKGRAPH
          </h1>
        </div>

        {/* 8-bit style tagline */}
        <div className="mb-8 space-y-4">
          <p className="text-2xl md:text-3xl font-bold text-cyan-400 pixel-text">
            &gt; THE <span className="text-white retro-flicker">ULTIMATE</span>{" "}
            CREATOR HUB_
          </p>
          <p className="text-lg md:text-xl text-green-300 pixel-text">
            // Built by devs, for devs & creators
          </p>
        </div>

        {/* Platform indicators - 8-bit style */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 border-2 border-green-400 px-4 py-2 bg-black">
            <Youtube className="h-6 w-6 text-green-400" />
            <span className="text-green-400 pixel-text">YT</span>
          </div>
          <div className="flex items-center space-x-2 border-2 border-cyan-400 px-4 py-2 bg-black">
            <Twitch className="h-6 w-6 text-cyan-400" />
            <span className="text-cyan-400 pixel-text">TTV</span>
          </div>
          <div className="flex items-center space-x-2 border-2 border-white px-4 py-2 bg-black">
            <Twitter className="h-6 w-6 text-white" />
            <span className="text-white pixel-text">X</span>
          </div>
        </div>

        {/* Tech showcase - terminal style */}
        <div className="mb-12 p-6 border-2 border-green-400 bg-black/80 mx-auto max-w-4xl">
          <p className="text-xl md:text-2xl text-green-400 pixel-text leading-relaxed">
            <span className="text-cyan-400">$</span> showcase --tech-stack
            <br />
            <span className="text-cyan-400">$</span> showcase --gaming-setup
            <br />
            <span className="text-cyan-400">$</span> showcase --creator-tools
            <br />
            <span className="retro-flicker">_</span>
          </p>
        </div>

        {/* 8-bit style buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <button
            onClick={scrollToQuiz}
            className="bg-green-400 hover:bg-green-300 text-black px-10 py-6 text-xl font-bold border-4 border-green-400 hover:border-green-300 transition-all duration-300 hover:scale-105 pixel-text retro-pulse"
            style={{ borderRadius: "0" }}
          >
            <Zap className="mr-3 h-6 w-6" />
            [START_BUILDING]
          </button>
          <button
            className="border-4 border-cyan-400 bg-black text-cyan-400 hover:bg-cyan-400 hover:text-black px-10 py-6 text-xl font-bold transition-all duration-300 pixel-text"
            style={{ borderRadius: "0" }}
          >
            [VIEW_DEMOS]
          </button>
        </div>

        {/* Animated scroll indicator */}
        <div className="retro-bounce cursor-pointer" onClick={scrollToQuiz}>
          <ArrowDown
            className="h-10 w-10 text-green-400 mx-auto"
            strokeWidth={3}
          />
          <p className="text-green-300 text-sm mt-2 pixel-text">
            &gt; DISCOVER_YOUR_STYLE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
