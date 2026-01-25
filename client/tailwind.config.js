/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backColor: "#242424",
        btnColor: "#ff648b",
      },
    },
  },
  plugins: [],
};
