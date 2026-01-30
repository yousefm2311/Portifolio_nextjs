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
          900: '#0B1B3A',
          800: '#12264D',
          700: '#1A3470',
          100: '#E9F0FF'
        },
        accent: {
          500: '#3BA0FF',
          400: '#65B6FF',
          300: '#8CC9FF'
        },
        surface: {
          900: '#091126',
          800: '#0E1B3A',
          700: '#152951',
          100: '#F4F7FF'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-ar)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgba(59, 160, 255, 0.35)',
        card: '0 20px 50px rgba(5, 20, 45, 0.35)'
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
