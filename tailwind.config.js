/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
        // Option 1: Modern and Professional
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        
        // Option 2: Classic Academic
        // sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        // heading: ['Crimson Pro', 'serif'],
        
        // Option 3: Clean and Modern
        // sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#4F46E5', 
          700: '#4338CA', 
        },
      },
    },
  },
  plugins: [],
}