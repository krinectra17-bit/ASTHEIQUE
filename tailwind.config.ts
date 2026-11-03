import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aesthique: {
          ivory: '#F8F4ED',
          gold: '#C99A68',
          copper: '#B97852',
          espresso: '#30251F',
          beige: '#E9DFD2',
          white: '#FFFFFF',
          charcoal: '#221915',
          cream: '#FAF6F0',
          sand: '#D4C5B2',
          accent: '#A6623F',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(48, 37, 31, 0.08)',
        'luxury-hover': '0 20px 40px -15px rgba(48, 37, 31, 0.15)',
        'gold-glow': '0 0 25px -5px rgba(201, 154, 104, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
