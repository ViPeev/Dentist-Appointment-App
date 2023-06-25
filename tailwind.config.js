/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx,js}'],
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '150ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
      },
    },
  },
  plugins: [],
}

