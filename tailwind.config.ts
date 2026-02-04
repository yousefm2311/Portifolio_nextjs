import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)'
        },
        accent: {
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          300: 'rgb(var(--accent-300) / <alpha-value>)'
        },
        surface: {
          900: 'rgb(var(--surface-900) / <alpha-value>)',
          800: 'rgb(var(--surface-800) / <alpha-value>)',
          700: 'rgb(var(--surface-700) / <alpha-value>)',
          100: 'rgb(var(--surface-100) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-ar)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgb(var(--accent-500) / 0.45)',
        card: '0 20px 50px rgb(var(--shadow) / 0.35)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    }
  },
  plugins: [typography]
};

export default config;
