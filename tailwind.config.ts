import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        "apple-soft":
          "0 24px 48px -24px rgba(0,0,0,0.5), 0 8px 24px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        "apple-card":
          "0 22px 45px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.55)"
      }
    }
  },
  plugins: []
};

export default config;
