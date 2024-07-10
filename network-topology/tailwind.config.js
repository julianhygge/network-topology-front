/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: '#49AC82',
        navColor:"#204A56",
        backPage:"#F5F5F5",
        sideBar:"#1A5A6C",
        gridColor:"#794C03",
        gridColor1:"#E4A83A",
      },
    },
  },
  plugins: [],
}