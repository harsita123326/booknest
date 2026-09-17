import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: { colors: { ink: "#172033", paper: "#fbfaf7", clay: "#ba5c3c" } },
  },
  plugins: [],
} satisfies Config;
