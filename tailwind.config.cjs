/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        "f1-bg": "#07070b",
        "f1-surface": "rgba(14, 18, 28, 0.7)",
        "f1-surface-strong": "rgba(20, 26, 38, 0.85)",
        "f1-red": "#ff2d3c",
        "f1-cyan": "#16f2ff",
        "f1-muted": "#a5b1c2"
      },
      boxShadow: {
        glass: "0 20px 50px rgba(0,0,0,0.45)",
        neon: "0 0 25px rgba(22, 242, 255, 0.25)"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px"
      },
      backdropBlur: {
        md: "14px"
      }
    }
  },
  plugins: []
};
