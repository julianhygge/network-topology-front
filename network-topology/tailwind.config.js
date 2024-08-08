const { width } = require('@mui/system');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        breadcrumbBackgroundColor: "#E7FAFF",
        customGreen: '#49AC82',
        customYellow: '#FFBE21',
        customBackground: '#BED2D4',
        customGrey: '#204A56',
        customBorderColor: '#C0C0C0',
        navColor: "#204A56",
        backPage: "#F5F5F5",
        sideBar: "#1A5A6C",
        gridColor: "#794C03",
        gridColor1: "#E4A83A",
        saveButtonColor: '#265B65',
        item1: '#98BEC9',
        item2: '#A5CFDB',
        item3: '#BCDCE5',
        item4: '#CDEEF7',
        brown: '#794C03',
        loadBuilderNavColor: "#DDF4FA",
        predefinedTemplatesSelected: "#F7FDFF",
      },
      spacing: {
        '7.25': '1.8125rem',
        '7.5': '1.875rem',
        '7.75': '1.9375rem',
        '7.625': '1.90625rem'
      },
      fontFamily: {
        dinPro: ['"DIN PRO"', 'sans-serif'],
      },
    },
  },
  plugins: [function({ addUtilities }) {
    addUtilities({
      '.no-scrollbar': {
        '&::-webkit-scrollbar': {
          width: '0px',
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      },
    });
  },],
}
