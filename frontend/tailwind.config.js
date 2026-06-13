/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode (allows toggling by adding 'dark' class to html/body element)
  darkMode: 'class',
  // Configure the file paths Tailwind should inspect to extract utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Extend the default theme attributes without overriding them completely
    extend: {
      // Define custom indigo accent tones for premium button highlighting
      colors: {
        slate: {
          900: '#0f172a', // Background dark tone
          800: '#1e293b', // Card/modal background dark tone
          700: '#334155', // Border element slate tone
          400: '#94a3b8', // Secondary paragraph text slate tone
        },
        indigo: {
          500: '#6366f1', // Standard button color
          600: '#4f46e5', // Button hover state color
          700: '#4338ca', // Active element accent color
        }
      }
    },
  },
  // List of extra plugins (empty by default)
  plugins: [],
}
