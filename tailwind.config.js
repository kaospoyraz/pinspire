/** @type {import(‘tailwindcss’).Config} */
module.exports = {
content: [
“./src/**/*.{js,jsx,ts,tsx}”,
],
theme: {
extend: {
colors: {
primary: {
50: ‘#fdf2f8’,
100: ‘#fce7f3’,
200: ‘#fbcfe8’,
300: ‘#f9a8d4’,
400: ‘#f472b6’,
500: ‘#ec4899’,
600: ‘#db2777’,
700: ‘#be185d’,
800: ‘#9d174d’,
900: ‘#831843’,
},
secondary: {
50: ‘#faf5ff’,
100: ‘#f3e8ff’,
200: ‘#e9d5ff’,
300: ‘#d8b4fe’,
400: ‘#c084fc’,
500: ‘#a855f7’,
600: ‘#9333ea’,
700: ‘#7e22ce’,
800: ‘#6b21a8’,
900: ‘#581c87’,
},
},
fontFamily: {
sans: [‘Inter’, ‘system-ui’, ‘sans-serif’],
},
boxShadow: {
‘soft’: ‘0 2px 15px rgba(0, 0, 0, 0.08)’,
‘hover’: ‘0 10px 40px rgba(0, 0, 0, 0.12)’,
},
animation: {
‘fade-in’: ‘fadeIn 0.5s ease-in-out’,
‘slide-up’: ‘slideUp 0.4s ease-out’,
‘scale’: ‘scale 0.3s ease-in-out’,
},
keyframes: {
fadeIn: {
‘0%’: { opacity: ‘0’ },
‘100%’: { opacity: ‘1’ },
},
slideUp: {
‘0%’: { transform: ‘translateY(20px)’, opacity: ‘0’ },
‘100%’: { transform: ‘translateY(0)’, opacity: ‘1’ },
},
scale: {
‘0%’: { transform: ‘scale(0.95)’ },
‘100%’: { transform: ‘scale(1)’ },
},
},
},
},
plugins: [],
}
