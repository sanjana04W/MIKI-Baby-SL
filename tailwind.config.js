/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        miki: {
          pink: "#F472B6",
          lightPink: "#FDF2F8",
          rose: "#FB7185",
          softRose: "#FFF1F2",
          yellow: "#FBBF24",
          lightYellow: "#FEF3C7",
          sky: "#38BDF8",
          lightSky: "#F0F9FF",
          mint: "#34D399",
          lightMint: "#ECFDF5",
          lavender: "#A78BFA",
          cream: "#FFFBF7",
          dark: "#1E293B",
          slate: "#334155",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(244, 114, 182, 0.08)",
        soft: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        card: "0 4px 20px -2px rgba(244, 114, 182, 0.12)",
      },
    },
  },
  plugins: [],
};
