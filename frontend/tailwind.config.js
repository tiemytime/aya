/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/ui inspired colors
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Custom Aya colors
        globe: {
          ocean: '#1e3a8a',
          land: '#16a34a',
          marker: '#fbbf24',
        }
      },
      animation: {
        'globe-rotate': 'rotate 20s linear infinite',
        'marker-pulse': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
};
