/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using the 'class' strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: 'var(--color-light-bg)',
          text: 'var(--color-light-text)',
          primary: 'var(--color-light-primary)',
        },
        dark: {
          background: 'var(--color-dark-bg)',
          text: 'var(--color-dark-text)',
          primary: 'var(--color-dark-primary)',
        },
      },
    },
  },
  plugins: [],
};
