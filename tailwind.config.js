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
      typography: {
        DEFAULT: {
          css: {
            color: '#fafafa',
            a: {
              color: '#22c55e',
              '&:hover': {
                color: '#22c55e',
              },
            },
            strong: {
              color: '#fafafa',
            },
            'ol > li::marker': {
              color: '#a1a1aa',
            },
            'ul > li::marker': {
              color: '#a1a1aa',
            },
            hr: {
              borderColor: '#27272a',
            },
            blockquote: {
              borderLeftColor: '#22c55e',
              color: '#a1a1aa',
            },
            h1: {
              color: '#fafafa',
            },
            h2: {
              color: '#fafafa',
            },
            h3: {
              color: '#fafafa',
            },
            h4: {
              color: '#fafafa',
            },
            'figure figcaption': {
              color: '#a1a1aa',
            },
            code: {
              color: '#fafafa',
            },
            'a code': {
              color: '#22c55e',
            },
            pre: {
              color: '#fafafa',
              backgroundColor: '#27272a',
            },
            thead: {
              color: '#fafafa',
              borderBottomColor: '#27272a',
            },
            'tbody tr': {
              borderBottomColor: '#27272a',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}

