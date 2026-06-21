/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#7C6FE8',
          50: '#F2F0FD',
          100: '#E6E2FB',
          200: '#CFC8F6',
          300: '#B3A8F0',
          400: '#9385EA',
          500: '#7C6FE8',
          600: '#6354D6',
          700: '#5343B4',
          800: '#443891',
          900: '#393175',
        },
        ink: '#2C2A4A',
        emerald: { soft: '#34D399' },
        sky: { soft: '#60A5FA' },
        amber: { soft: '#F59E0B' },
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(86, 70, 180, 0.28)',
        card: '0 24px 60px -28px rgba(86, 70, 180, 0.30)',
        glow: '0 0 0 6px rgba(124, 111, 232, 0.10)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-22px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.12)' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
