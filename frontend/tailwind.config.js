/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#166534", // Deep green
        secondary: "#22c55e", // Agricultural green
        accent: "#3b82f6", // Blue
        background: "#f8fafc", // Very light neutral
        warning: "#f59e0b", // Amber
        danger: "#ef4444", // Red
      }
    },
  },
  plugins: [],
}
