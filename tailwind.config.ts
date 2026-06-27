import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        paper: "#FFFCF2",
        rainbow: {
          coral: "#FF6B6B",
          tangerine: "#FFA63D",
          lemon: "#FFD93D",
          lime: "#6BCB77",
          sky: "#4D96FF",
          grape: "#9B5DE5",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0 #161616",
        brutalSm: "3px 3px 0 #161616",
      },
      borderRadius: {
        none: "0px",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        "mono-custom": ["var(--font-mono-custom)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
