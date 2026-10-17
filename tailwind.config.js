/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple HIG Dynamic System Grouped Colors
        apple: {
          bg: 'rgb(var(--apple-bg) / <alpha-value>)',
          card: 'rgb(var(--apple-card) / <alpha-value>)',
          'card-hover': 'rgb(var(--apple-card-hover) / <alpha-value>)',
          well: 'rgb(var(--apple-well) / <alpha-value>)',
          chip: 'rgb(var(--apple-chip) / <alpha-value>)',
          'chip-hover': 'rgb(var(--apple-chip-hover) / <alpha-value>)',
          elevated: 'rgb(var(--apple-elevated) / <alpha-value>)',
          border: 'var(--apple-border)',
          'border-strong': 'var(--apple-border-strong)',
          'border-subtle': 'var(--apple-border-subtle)',
          label: 'rgb(var(--apple-label) / <alpha-value>)',
          'label-secondary': 'rgb(var(--apple-label-secondary) / <alpha-value>)',
          'label-tertiary': 'rgb(var(--apple-label-tertiary) / <alpha-value>)',
          blue: 'rgb(var(--apple-blue) / <alpha-value>)',
          'blue-hover': 'rgb(var(--apple-blue-hover) / <alpha-value>)',
          green: 'rgb(var(--apple-green) / <alpha-value>)',
          orange: 'rgb(var(--apple-orange) / <alpha-value>)',
          red: 'rgb(var(--apple-red) / <alpha-value>)',
          purple: 'rgb(var(--apple-purple) / <alpha-value>)',
          pink: 'rgb(var(--apple-pink) / <alpha-value>)',
          teal: 'rgb(var(--apple-teal) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'SFMono-Regular',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
        '15': '3.75rem',
      },
      borderRadius: {
        'apple-xs': '6px',
        'apple-sm': '10px',
        'apple-md': '14px',
        'apple-lg': '18px',
        'apple-card': '22px',
        'apple-hero': '28px',
        'apple-2xl': '32px',
        'apple': '14px',
        'apple-xl': '24px',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-card-dark': '0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'apple-glow': '0 0 24px -4px rgba(10, 132, 255, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
