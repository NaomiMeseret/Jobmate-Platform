import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Editorial voice: serif for display, Geist for body, mono for labels.
        display: [
          "var(--font-display)",
          "var(--font-ethiopic-serif)",
          "Georgia",
          "serif",
        ],
        body: ["var(--font-geist-sans)", "var(--font-ethiopic)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-geist-sans)", "var(--font-ethiopic)", "sans-serif"],
      },
      borderRadius: {
        none: "0",
        sm: "1px",
        DEFAULT: "2px",
        md: "2px",
        lg: "3px",
        xl: "4px",
        "2xl": "6px",
        "3xl": "8px",
      },
    },
  },
  plugins: [],
};

export default config;
