/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "-apple-system", "sans-serif"],
        script: ['"Caveat"', "cursive"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      boxShadow: {
        glass: "0 8px 30px rgba(15, 23, 42, 0.05)",
        "glass-sm": "0 4px 20px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 14px 35px -6px rgba(37, 99, 235, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)",
        modal: "0 25px 60px -12px rgba(15, 23, 42, 0.22)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
