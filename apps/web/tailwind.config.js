/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#064e3b',
          dark: '#022c22',
          light: '#0d9488',
          subtle: '#f0fdf4',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          DEFAULT: '#c5a059',
          hover: '#b38e47',
          subtle: '#fef9ee',
          light: '#dfc792',
          dark: '#937435',
        },
        surface: {
          bg: '#fbfaf8',
          card: '#ffffff',
          muted: '#f4f1eb',
          border: '#e5e2da',
        },
        charcoal: {
          DEFAULT: '#18181b',
          heading: '#09090b',
          muted: '#71717a',
          light: '#a1a1aa',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '740px',
            color: '#18181b',
            lineHeight: '1.85',
            p: {
              marginBottom: '1.5em',
              fontSize: '1.125rem',
            },
            h2: {
              fontFamily: 'Merriweather, Georgia, serif',
              color: '#064e3b',
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '0.8em',
            },
            h3: {
              color: '#09090b',
              fontWeight: '600',
              marginTop: '1.8em',
              marginBottom: '0.6em',
            },
            blockquote: {
              borderLeftColor: '#c5a059',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              backgroundColor: '#fef9ee',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              color: '#022c22',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
