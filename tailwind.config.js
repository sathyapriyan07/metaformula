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
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        bebas: ['Bebas Neue', 'Inter', 'sans-serif'],
      },
      colors: {
        'f1-red': '#E10600',
        'f1-red-hover': '#B30500',
        'f1-dark': '#111111',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'f1': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'f1-hover': '0 8px 30px rgba(225, 6, 0, 0.3)',
      },
      letterSpacing: {
        'f1': '0.05em',
      },
    },
  },
  plugins: [],
}
