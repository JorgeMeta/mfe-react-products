/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // container
    "../products/src/**/*.{js,jsx,ts,tsx}", // remote products
    "../cart/src/**/*.{js,jsx,ts,tsx}", // remote cart
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
