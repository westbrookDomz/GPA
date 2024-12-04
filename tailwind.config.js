/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        github: {
          // Light mode
          bg: "#ffffff",
          "bg-secondary": "#f6f8fa",
          border: "#d0d7de",
          fg: "#24292f",
          "fg-muted": "#57606a",
          accent: "#0969da",
          success: "#1a7f37",
          danger: "#cf222e",

          // Dark mode
          "dark-bg": "#0d1117",
          "dark-bg-secondary": "#161b22",
          "dark-border": "#30363d",
          "dark-fg": "#c9d1d9",
          "dark-fg-muted": "#8b949e",
          "dark-accent": "#58a6ff",
          "dark-success": "#3fb950",
          "dark-danger": "#f85149",
        },
      },
    },
  },
  plugins: [],
};
