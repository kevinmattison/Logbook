import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: "#16233A",
        haze: "#7B93A8",
        sky: "#3E7CB1",
        skylight: "#EAF1F6",
        thermal: "#E8A23D",
        ridge: "#4F8A6D",
        alert: "#C1553D",
        paper: "#F7F9FA",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        atmosphere:
          "linear-gradient(180deg, #16233A 0%, #234669 38%, #3E7CB1 72%, #7FB0CE 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
