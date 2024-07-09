/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: '#49AC82',
        customYellow: '#FFBE21',
        navColor:"#204A56",
        backPage:"#F5F5F5"
      },
    },
  },
  plugins: [],
}