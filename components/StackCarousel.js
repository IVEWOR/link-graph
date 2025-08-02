"use client";

import Image from "next/image";
import React from "react";

// The data for the carousel. I've added more users for a longer scroll.
const stacks = [
  {
    user: "sarahdrasner",
    name: "Sarah Drasner",
    image: "https://i.pravatar.cc/500",
  },
  {
    user: "dan_abramov",
    name: "Dan Abramov",
    image: "https://i.pravatar.cc/600",
  },
  {
    user: "kentcdodds",
    name: "Kent C. Dodds",
    image: "https://i.pravatar.cc/505",
  },
  { user: "wesbos", name: "Wes Bos", image: "https://i.pravatar.cc/620" },
  {
    user: "tannerlinsley",
    name: "Tanner Linsley",
    image: "https://i.pravatar.cc/510",
  },
  {
    user: "evan_you",
    name: "Evan You",
    image: "https://i.pravatar.cc/520",
  },
  {
    user: "leerob",
    name: "Lee Robinson",
    image: "https://i.pravatar.cc/550",
  },
  {
    user: "rauchg",
    name: "Guillermo Rauch",
    image: "https://i.pravatar.cc/560",
  },
  { user: "swyx", name: "Shawn Wang", image: "https://i.pravatar.cc/570" },
  {
    user: "cassidoo",
    name: "Cassidy Williams",
    image: "https://i.pravatar.cc/580",
  },
];

// We duplicate the array to create a seamless loop
const duplicatedStacks = [...stacks, ...stacks];

const StackCarousel = () => {
  return (
    <section className="py-20 sm:py-24 w-full">
      <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Explore Popular Stacks
      </h3>
      <div className="relative w-full overflow-hidden group">
        <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">
          {duplicatedStacks.map((stack, index) => (
            <div key={index} className="flex-shrink-0 w-68 mx-4">
              <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Image
                  className="w-full h-52 object-cover"
                  src={stack.image.replace(".png", "")} // Use GitHub avatar URL format
                  alt={`Profile picture of ${stack.name}`}
                  width={200}
                  height={200}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://i.pravatar.cc/600`;
                  }} // Fallback
                />
                <p className="text-lg font-bold text-center p-4 text-gray-900 dark:text-white">
                  {stack.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* These are the fade overlays for the left and right sides.
                  They use gradients that fade from the background color to transparent.
                */}
        <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-1/4 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default StackCarousel;
