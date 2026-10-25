import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#0A0A0C",
        cream: "#141418",
        sand: "#202027",
        ink: "#F4F2EE",
        char: "#DCD8D2",
        muted: "#9B9AA2",
        line: "#2A2A32",
        red: {
          DEFAULT: "#E51828",
          deep: "#B8111F",
          soft: "#3A1016",
          tint: "#FF8E97",
        },
        indigo: {
          DEFAULT: "#1B2E3F",
          deep: "#0C141B",
          mist: "#8FA6B7",
        },
      },
      fontFamily: {
        display: ["Inter", "Segoe UI", "system-ui", "-apple-system", "sans-serif"],
        sans: ["Inter", "Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        label: "0.24em",
      },
      boxShadow: {
        lift: "0 34px 80px -40px rgba(0,0,0,0.95)",
        panel: "inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 60px -40px rgba(0,0,0,0.95)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        "spin-slow": "spinSlow 26s linear infinite",
        rise: "rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
