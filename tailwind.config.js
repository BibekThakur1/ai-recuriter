/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--card-background)",
        border: "var(--border)",
        
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        
        success: "var(--success)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
