const c = (v) => `rgb(var(--${v}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        fg: c('fg'),
        muted: c('muted'),
        card: c('card'),
        line: c('line'),
        accent: c('accent'),
        accent2: c('accent2'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px -14px rgb(var(--shadow) / 0.22)',
      },
    },
  },
  plugins: [],
}
