/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apple-dark': '#000000',
        'apple-charcoal': '#0a0a0a',
        'apple-gray': '#1c1c1e',
        'apple-muted': '#8e8e93',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
        'glow-hover': '0 0 30px rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        'glass': '24px',
      },
    },
  },
  plugins: [],
}
