/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111827',
        card: '#1f2937',
        primary: '#4F46E5',
        accent: '#22C55E',
      },
    },
  },
  plugins: [],
}
