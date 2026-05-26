import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: "#020b18",
          mid: "#0b1f38",
          light: "#153254",
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delay": "float 4s ease-in-out 1s infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pop-in": "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        "spin-slow": "spin 8s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        bubble: "bubble 6s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-24px) rotate(3deg)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(0,212,255,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.8)" },
        },
        bubble: {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.3" },
          "100%": { transform: "translateY(-20px) scale(1)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
