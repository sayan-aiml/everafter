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
        paper: "#FAF9F6",         // warmer, luxury off-white paper
        "paper-pure": "#FFFFFF",
        ink: "#121118",          // rich editorial obsidian
        "ink-soft": "#565266",
        "ink-muted": "#8A849B",
        magenta: {
          DEFAULT: "#E63E9C",
          soft: "#FF7BC3",
          deep: "#AD1C6F",
          glow: "rgba(230, 62, 156, 0.25)",
        },
        rose: {
          DEFAULT: "#F43F5E",
          soft: "#FB7185",
          blush: "#FFF1F2",
        },
        lavender: {
          DEFAULT: "#9B8AE6",
          soft: "#E2DBFC",
          deep: "#5B43C2",
          mist: "rgba(155, 138, 230, 0.15)",
        },
        gold: {
          DEFAULT: "#D97706",
          soft: "#FDE68A",
          glow: "rgba(217, 119, 6, 0.2)",
        },
        hairline: "#EAE7F2",      // ultra-subtle border color
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        mono: ["monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #E63E9C 0%, #9B8AE6 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(230,62,156,0.08) 0%, rgba(155,138,230,0.12) 100%)",
        "romantic-sunset": "linear-gradient(135deg, #FF6FB8 0%, #9B8AE6 50%, #F59E0B 100%)",
        "glass-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%)",
        "dark-glass": "linear-gradient(180deg, rgba(18, 17, 24, 0.85) 0%, rgba(18, 17, 24, 0.7) 100%)",
      },
      boxShadow: {
        editorial: "0 2px 8px -2px rgba(18,17,24,0.05), 0 1px 3px rgba(18,17,24,0.03)",
        glass: "0 8px 32px 0 rgba(155, 138, 230, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
        glow: "0 8px 30px rgba(230,62,156,0.22)",
        "glow-lavender": "0 8px 30px rgba(155,138,230,0.25)",
        "glow-gold": "0 8px 30px rgba(245,158,11,0.25)",
        floating: "0 20px 40px -15px rgba(18,17,24,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;

