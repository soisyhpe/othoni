/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#0C0C0C',
        'custom-darker': '#0F0F0F',
        'custom-red': '#FC3D26',
        'custom-border': '#282828'
      },
    }
  },
  plugins: [],
}

