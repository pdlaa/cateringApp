/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 60% - Neutral Canvas
        cream: {
          50: '#FDFCFB',
          100: '#F9F6F0', // Primary canvas
          200: '#F0EBE0',
        },
        charcoal: {
          900: '#1E1E1E', // Dark mode canvas
          800: '#2D2D2D',
          700: '#3C3C3C',
        },
        // 30% - Secondary Warm Accents
        terracotta: {
          500: '#C8796B', // Primary accent
          600: '#B8695B',
          700: '#A8594B',
        },
        gold: {
          500: '#B89A6A', // Secondary accent
          600: '#A88A5A',
          400: '#C8AA7A',
        },
        // 10% - CTA & High Contrast
        primary: {
          500: '#2D5A4A', // Deep forest green untuk CTA
          600: '#1E4A3A',
          700: '#0F3A2A',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        // Display/Heading - Serif modern
        display: ['var(--font-playfair)', 'serif'],
        // Body - Sans-serif bersih
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        // Dynamic typography scale
        'display': ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.1' }],
        'h1': ['clamp(2rem, 4vw + 0.5rem, 3.5rem)', { lineHeight: '1.2' }],
        'h2': ['clamp(1.5rem, 3vw + 0.5rem, 2.5rem)', { lineHeight: '1.3' }],
        'h3': ['clamp(1.25rem, 2vw + 0.5rem, 1.75rem)', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}