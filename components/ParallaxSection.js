"use client";
import React, { useState, useEffect } from "react";

export default function ParallaxSection({ mousePosition }) {
  // isMounted state prevents the parallax calculation on the server and during initial client render.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // When the component mounts on the client, set isMounted to true.
    setIsMounted(true);
  }, []);

  // Calculate parallax values only if the component is mounted on the client.
  // Otherwise, default to 0 to match the server-rendered output.
  const mouseParallaxX = isMounted
    ? (mousePosition.x - window.innerWidth / 1) * 0.005
    : 0;
  const mouseParallaxY = isMounted
    ? (mousePosition.y - window.innerHeight / 1) * 0.005
    : 0;

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 ">
      {/* Theme-aware single subtle gradient that follows mouse */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-200/20 via-transparent to-green-100/20 dark:from-green-900/3 dark:via-transparent dark:to-green-800/3 -z-50"
        style={{
          transform: `translate(${mouseParallaxX * 10}px, ${
            mouseParallaxY * 10
          }px)`,
          // Only apply the transition after mounting to prevent a visual jump.
          transition: isMounted ? "transform 0.3s ease-out" : "none",
        }}
      />
    </div>
  );
}
