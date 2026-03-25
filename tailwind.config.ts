import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        grow: {
          bg: "#060d07",
          panel: "rgba(12,22,13,0.60)",
          border: "rgba(41,181,84,0.08)",
          muted: "#5a7a62",
          text: "#e2ede4",
          primary: "#29b554",
          secondary: "#7ed348",
          glow: "rgba(41,181,84,0.55)",
          tint: "rgba(41,181,84,0.07)",
          amber: "#f59e0b",
          rose: "#f43f5e",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "26px",
      },
      animation: {
        "float": "float 3.6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.6s ease-in-out infinite",
        "fade-in": "fade-in 0.18s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 3px 10px rgba(0,0,0,0.55), 0 0 0 0 rgba(41,181,84,0)" },
          "50%": { boxShadow: "0 3px 10px rgba(0,0,0,0.55), 0 0 0 5px rgba(41,181,84,0.12)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(12px)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
