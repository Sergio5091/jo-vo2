/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#1e40af',
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        primary: {
          DEFAULT: '#1e40af',
          'primary-foreground': '#f8fafc',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: '#f1f5f9',
        'secondary-foreground': '#0f172a',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        accent: '#f1f5f9',
        'accent-foreground': '#0f172a',
        destructive: '#ef4444',
        'destructive-foreground': '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
