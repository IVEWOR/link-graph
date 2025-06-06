/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neonGreen: "#39FF14",
        cyberBlue: "#03A9F4",
        neonMagenta: "#FF00FF",
        offBlack: "#0D0D0D",
        offWhite: "#F2F2F2",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "cursive"],
      },
    },
  },
  plugins: [],
};
