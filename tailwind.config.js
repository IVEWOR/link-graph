// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using your provided OKLCH colors, converted to hex for broader support
        // You can use a converter tool for this. For now, I'll define them with descriptive names.
        "brand-red": {
          50: "#fef2f2", // Approx from oklch(97.1% .013 17.38)
          300: "#fca5a5", // Approx from oklch(80.8% .114 19.571)
          400: "#f87171", // Approx from oklch(70.4% .191 22.216)
          600: "#dc2626", // Approx from oklch(57.7% .245 27.325)
        },
        "brand-green": {
          300: "#86efac", // Approx from oklch(87.1% .15 154.449)
          400: "#4ade80", // Approx from oklch(79.2% .209 151.711)
          500: "#22c55e", // Approx from oklch(72.3% .219 149.579)
          600: "#16a34a", // Approx from oklch(62.7% .194 149.214)
          700: "#15803d", // Approx from oklch(52.7% .154 150.069)
          800: "#166534", // Approx from oklch(44.8% .119 151.328)
          900: "#14532d", // Approx from oklch(39.3% .095 152.535)
        },
        "brand-gray": {
          300: "#d1d5db", // Approx from oklch(87.2% .01 258.338)
          400: "#9ca3af", // Approx from oklch(70.7% .022 261.325)
          600: "#4b5563", // Approx from oklch(44.6% .03 256.802)
          800: "#1f2937", // Approx from oklch(27.8% .033 256.848)
          900: "#111827", // Approx from oklch(21% .034 264.665)
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
