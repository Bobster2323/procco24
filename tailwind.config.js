/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'procco-dark': '#1a1a1a',
        'procco-light': '#f5f5f5',
        'procco-primary': '#333333',
        'procco-hover': '#2a2a2a',
      },
    },
  },
  plugins: [],
};