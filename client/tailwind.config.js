/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf5",
          100: "#d6f9e4",
          200: "#aef2cb",
          300: "#78e5ab",
          400: "#42d187",
          500: "#1fb56d",
          600: "#149257",
          700: "#127548",
          800: "#125c3c",
          900: "#104b33",
        },
      },
    },
  },
  plugins: [],
};
