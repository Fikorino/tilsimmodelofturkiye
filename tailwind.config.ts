import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        gold: "var(--gold)",
        gold2: "var(--gold2)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(214, 178, 94, 0.2)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, rgba(214,178,94,0.2), rgba(185,146,59,0.05))",
      },
    },
  },
  plugins: [],
};

export default config;
