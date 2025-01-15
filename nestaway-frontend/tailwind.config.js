/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        accent1: "var(--color-accent1)",
        accent2: "var(--color-accent2)",
        info: "var(--color-info)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        action: "var(--color-action)",
      },
      fontFamily: {
        comic: "var(--font-comic) !important",
        didact: "var(--font-didact) !important",
      },
      boxShadow: {
        shadow1: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        shadow2: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
        shadow3: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
      },
    },
  },
  plugins: [],
};
