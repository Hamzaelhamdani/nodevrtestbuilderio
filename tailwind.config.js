/** @type {import('tailwindcss').Config} */
export default {
  // Force dark mode always
  darkMode: ['class', 'media'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        input: {
          DEFAULT: "var(--input)",
          background: "var(--input-background)",
          border: "var(--input-border)",
          foreground: "var(--input-foreground)",
        },
        'card': '#1e1e1e',
        'card-foreground': '#d6dde6',
        'primary': '#c1f17e',
        'primary-foreground': '#080f17',
        'secondary': '#a7ee43',
        'secondary-foreground': '#080f17',
        'tertiary': '#8A4FFF',
        'tertiary-foreground': '#ffffff',
        muted: 'rgba(214, 221, 230, 0.1)',
        'muted-foreground': 'rgba(214, 221, 230, 0.62)',
        accent: 'rgba(255, 255, 255, 0.04)',
        'accent-foreground': '#d6dde6',
        destructive: '#d4183d',
        'destructive-foreground': '#ffffff',
        border: 'rgba(214, 221, 230, 0.2)',
        'outline-ring': '#c1f17e', // Added outline-ring color to fix CSS issues
        'chart-1': '#c1f17e',
        'chart-2': '#a7ee43',
        'chart-3': '#8A4FFF',
        'chart-4': '#FF6B00',
        'chart-5': '#0066FF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
