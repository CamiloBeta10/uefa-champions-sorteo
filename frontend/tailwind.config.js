/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      animation: {
          colors: {
        championsBlue: "#1C2341",
        championsGold: "#FFD700",
        championsSilver: "#A9A9A9"
        },
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}