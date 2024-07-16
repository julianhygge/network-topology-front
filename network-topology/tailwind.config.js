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
        customBackground: '#BED2D4',
        customGrey: '#204A56',
        customBorderColor: '#C0C0C0',
        navColor:"#204A56",
        backPage:"#F5F5F5",
        sideBar:"#1A5A6C",
        gridColor:"#794C03",
        gridColor1:"#E4A83A",
      },
      spacing: {
        '7.75': '1.9375rem', 
        '7.625': '1.90625rem'
      },
    },
  },
  plugins: [],
}