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
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          surface: "rgb(var(--color-surface))",
          "surface-alt": "rgb(var(--color-surface-alt))",
          border: "rgb(var(--color-border))",
          "border-strong": "rgb(var(--color-border-strong))",
          text: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          "primary-hover": "rgb(var(--color-primary-hover) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
          glow: "rgb(var(--color-glow))",
          tint: "rgb(var(--color-tint))",
          overlay: "rgb(var(--color-overlay))",
          success: "rgb(var(--color-success) / <alpha-value>)",
          warning: "rgb(var(--color-warning) / <alpha-value>)",
          danger: "rgb(var(--color-danger) / <alpha-value>)",
          info: "rgb(var(--color-info) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "26px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      animation: {
        float: "float 3.6s ease-in-out infinite",
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
          "0%, 100%": { boxShadow: "0 3px 10px rgb(0 0 0 / 0.55), 0 0 0 0 rgb(var(--color-primary) / 0)" },
          "50%": { boxShadow: "0 3px 10px rgb(0 0 0 / 0.55), 0 0 0 5px rgb(var(--color-primary) / 0.12)" },
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
