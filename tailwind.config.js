/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#27272a",
        input: "#27272a",
        ring: "#22c55e",
        background: "#09090b",
        foreground: "#fafafa",
        primary: {
          DEFAULT: "#22c55e",
          foreground: "#052e16",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        destructive: {
          DEFAULT: "#7f1d1d",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        card: {
          DEFAULT: "#09090b",
          foreground: "#fafafa",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

