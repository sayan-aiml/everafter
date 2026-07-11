import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#111014",          // near-black editorial text
        "ink-soft": "#4A4750",
        magenta: {
          DEFAULT: "#E63E9C",
          soft: "#FF6FB8",
          deep: "#B92C7E",
        },
        lavender: {
          DEFAULT: "#9B8AE6",
          soft: "#DAD1F7",
          deep: "#6E58C9",
        },
        hairline: "#E7E5EC",      // subtle 1px border color
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #E63E9C 0%, #9B8AE6 100%)",
      },
      boxShadow: {
        editorial: "0 1px 2px rgba(17,16,20,0.04)",
        glow: "0 8px 24px rgba(230,62,156,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
