import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8A1538", // deep bordeaux — matches an upscale grill-house identity
          dark: "#5E0E26",
          gold: "#C9A24B",
          cream: "#FBF6EE",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
