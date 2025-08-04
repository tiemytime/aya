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
        // Enhanced Cosmic & Celestial Color Palette
        cosmic: {
          // Deep Space Blues - Enhanced for depth
          void: '#000210',
          'deep-space': '#0a0e27',
          'nebula-blue': '#1e293b',
          'stellar-blue': '#334155',
          'cosmic-blue': '#475569',
          'space-blue': '#0f172a',
          'midnight-blue': '#1e1b4b',
          'celestial-blue': '#1e40af',
          // Ethereal Purples - More vibrant
          'mystic-purple': '#312e81',
          'astral-purple': '#4c1d95',
          'ethereal-purple': '#6d28d9',
          'spirit-purple': '#8b5cf6',
          'dream-purple': '#a78bfa',
          'cosmic-purple': '#7c3aed',
          'galaxy-purple': '#5b21b6',
          'violet-mist': '#c4b5fd',
          // Radiant Golds & Celestial Accents - More brilliant
          'solar-gold': '#fbbf24',
          'stellar-gold': '#f59e0b',
          'divine-gold': '#d97706',
          'celestial-gold': '#ffedd5',
          'radiant-gold': '#fef3c7',
          'cosmic-gold': '#fcd34d',
          'stardust-gold': '#fde68a',
          'aurora-gold': '#fff7ed',
          // Mystical Additional Colors - Enhanced vibrancy
          'aurora-green': '#10b981',
          'spirit-teal': '#14b8a6',
          'ethereal-cyan': '#06b6d4',
          'plasma-pink': '#ec4899',
          'cosmic-rose': '#f472b6',
          'nebula-orange': '#f97316',
          'solar-orange': '#ea580c',
          'moonlight': '#e2e8f0',
          'starlight': '#f1f5f9',
          'cosmic-white': '#fefefe',
          'silver-mist': '#cbd5e1',
        },
        // Enhanced Globe colors
        globe: {
          ocean: '#1e3a8a',
          'deep-ocean': '#1e40af',
          land: '#16a34a',
          'mystical-land': '#059669',
          marker: '#fbbf24',
          'active-marker': '#f59e0b',
          glow: '#fef3c7',
        },
        // Glassmorphism specific colors
        glass: {
          'bg-light': 'rgba(255, 255, 255, 0.1)',
          'bg-medium': 'rgba(255, 255, 255, 0.2)',
          'bg-dark': 'rgba(0, 0, 0, 0.3)',
          'border-light': 'rgba(255, 255, 255, 0.2)',
          'border-medium': 'rgba(255, 255, 255, 0.3)',
        }
      },
      animation: {
        // Existing animations
        'globe-rotate': 'rotate 20s linear infinite',
        'marker-pulse': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        // Enhanced cosmic animations
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-slow': 'breathe 6s ease-in-out infinite',
        'breathe-gentle': 'breathe 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-pulse-slow': 'glowPulse 3s ease-in-out infinite',
        'glow-intense': 'glowIntense 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'float-gentle': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'cosmic-spin': 'cosmicSpin 8s linear infinite',
        'cosmic-spin-slow': 'cosmicSpin 12s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'twinkle-fast': 'twinkle 1s ease-in-out infinite',
        'twinkle-slow': 'twinkle 3s ease-in-out infinite',
        'aurora': 'aurora 4s ease-in-out infinite',
        'aurora-slow': 'aurora 6s ease-in-out infinite',
        // New parallax and immersive animations
        'parallax-slow': 'parallaxSlow 20s linear infinite',
        'parallax-medium': 'parallaxMedium 15s linear infinite',
        'parallax-fast': 'parallaxFast 10s linear infinite',
        'cosmic-breathe': 'cosmicBreathe 5s ease-in-out infinite',
        'radial-pulse': 'radialPulse 3s ease-in-out infinite',
        'radial-pulse-intense': 'radialPulseIntense 2s ease-in-out infinite',
        'stellar-drift': 'stellarDrift 25s linear infinite',
        'nebula-flow': 'nebulaFlow 30s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        breathe: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1'
          },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(251, 191, 36, 0.5), 0 0 10px rgba(251, 191, 36, 0.3), 0 0 15px rgba(251, 191, 36, 0.1)',
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(251, 191, 36, 0.4)',
          },
        },
        glowIntense: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(251, 191, 36, 1), 0 0 40px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.6)',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)',
          },
          '50%': { 
            transform: 'translateY(-6px)',
          },
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
          },
          '100%': { 
            backgroundPosition: '200% 0',
          },
        },
        cosmicSpin: {
          '0%': { 
            transform: 'rotate(0deg)',
          },
          '100%': { 
            transform: 'rotate(360deg)',
          },
        },
        twinkle: {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.2)',
          },
        },
        aurora: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
          },
        },
        // New immersive keyframes
        parallaxSlow: {
          '0%': { 
            transform: 'translateX(0px) translateY(0px)',
          },
          '100%': { 
            transform: 'translateX(-10px) translateY(-5px)',
          },
        },
        parallaxMedium: {
          '0%': { 
            transform: 'translateX(0px) translateY(0px)',
          },
          '100%': { 
            transform: 'translateX(-20px) translateY(-10px)',
          },
        },
        parallaxFast: {
          '0%': { 
            transform: 'translateX(0px) translateY(0px)',
          },
          '100%': { 
            transform: 'translateX(-30px) translateY(-15px)',
          },
        },
        cosmicBreathe: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.7',
            filter: 'blur(0px)',
          },
          '50%': { 
            transform: 'scale(1.1)',
            opacity: '1',
            filter: 'blur(1px)',
          },
        },
        radialPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.6',
          },
          '50%': { 
            transform: 'scale(1.3)',
            opacity: '0.9',
          },
        },
        radialPulseIntense: {
          '0%, 100%': { 
            transform: 'scale(0.8)',
            opacity: '0.4',
          },
          '50%': { 
            transform: 'scale(1.5)',
            opacity: '1',
          },
        },
        stellarDrift: {
          '0%': { 
            transform: 'translateX(-100px) translateY(-50px) rotate(0deg)',
          },
          '100%': { 
            transform: 'translateX(100px) translateY(50px) rotate(360deg)',
          },
        },
        nebulaFlow: {
          '0%, 100%': { 
            backgroundPosition: '0% 0%',
            transform: 'scale(1)',
          },
          '50%': { 
            backgroundPosition: '100% 100%',
            transform: 'scale(1.05)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cosmic': 'linear-gradient(135deg, #000210 0%, #1e293b 50%, #312e81 100%)',
        'gradient-nebula': 'linear-gradient(45deg, #312e81, #4c1d95, #6d28d9)',
        'gradient-aurora': 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #f59e0b)',
        'gradient-stellar': 'radial-gradient(ellipse at center, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        // Enhanced cosmic gradients
        'gradient-deep-space': 'linear-gradient(180deg, #000210 0%, #0a0e27 25%, #1e1b4b 50%, #312e81 100%)',
        'gradient-galaxy': 'radial-gradient(ellipse at center, #4c1d95 0%, #1e1b4b 30%, #0a0e27 70%, #000210 100%)',
        'gradient-cosmic-glow': 'radial-gradient(circle at center, #fbbf24 0%, #f59e0b 25%, #d97706 50%, transparent 70%)',
        'gradient-ethereal': 'linear-gradient(45deg, #8b5cf6, #a78bfa, #c4b5fd, #e9d5ff)',
        'gradient-mystical': 'conic-gradient(from 0deg, #312e81, #4c1d95, #6d28d9, #8b5cf6, #312e81)',
        'gradient-stardust': 'radial-gradient(ellipse at top, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, transparent 80%)',
        'gradient-plasma': 'linear-gradient(135deg, #ec4899, #f472b6, #8b5cf6, #06b6d4)',
      },
      boxShadow: {
        // Enhanced cosmic depth shadows
        'cosmic-sm': '0 2px 4px rgba(0, 2, 16, 0.15), 0 1px 2px rgba(49, 46, 129, 0.1)',
        'cosmic': '0 4px 6px rgba(0, 2, 16, 0.2), 0 2px 4px rgba(49, 46, 129, 0.15)',
        'cosmic-md': '0 6px 10px rgba(0, 2, 16, 0.25), 0 2px 4px rgba(49, 46, 129, 0.15)',
        'cosmic-lg': '0 10px 15px rgba(0, 2, 16, 0.3), 0 4px 6px rgba(49, 46, 129, 0.2)',
        'cosmic-xl': '0 20px 25px rgba(0, 2, 16, 0.35), 0 8px 10px rgba(49, 46, 129, 0.2)',
        'cosmic-2xl': '0 25px 50px rgba(0, 2, 16, 0.4), 0 12px 24px rgba(49, 46, 129, 0.25)',
        // Enhanced floating glassmorphism shadows
        'float-light': '0 8px 32px rgba(255, 255, 255, 0.12), 0 4px 16px rgba(251, 191, 36, 0.08)',
        'float-medium': '0 12px 40px rgba(255, 255, 255, 0.18), 0 6px 20px rgba(251, 191, 36, 0.12)',
        'float-heavy': '0 16px 50px rgba(255, 255, 255, 0.25), 0 8px 25px rgba(251, 191, 36, 0.18)',
        'float-ethereal': '0 20px 60px rgba(139, 92, 246, 0.15), 0 10px 30px rgba(167, 139, 250, 0.1)',
        // Enhanced glow effects
        'glow-gold': '0 0 10px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)',
        'glow-purple': '0 0 10px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)',
        'glow-blue': '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)',
        'glow-intense': '0 0 15px rgba(251, 191, 36, 0.9), 0 0 30px rgba(251, 191, 36, 0.7), 0 0 45px rgba(251, 191, 36, 0.5)',
        'glow-ethereal': '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)',
        'glow-plasma': '0 0 15px rgba(236, 72, 153, 0.7), 0 0 30px rgba(244, 114, 182, 0.5), 0 0 45px rgba(139, 92, 246, 0.3)',
        // Inner glows for glassmorphism
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'inner-glow-strong': 'inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        'inner-glow-cosmic': 'inset 0 1px 0 rgba(251, 191, 36, 0.3), inset 0 2px 4px rgba(139, 92, 246, 0.2)',
        // Deep space shadows for immersion
        'deep-space': '0 50px 100px rgba(0, 2, 16, 0.5), 0 25px 50px rgba(30, 27, 75, 0.3)',
        'void': '0 0 100px rgba(0, 2, 16, 0.8), inset 0 0 50px rgba(0, 2, 16, 0.5)',
        'nebula': '0 20px 80px rgba(109, 40, 217, 0.4), 0 10px 40px rgba(139, 92, 246, 0.3)',
      },
      backdropBlur: {
        'cosmic': '16px',
        'ethereal': '24px',
      },
      fontFamily: {
        'elegant': ['Cormorant Garamond', 'serif'],
        'modern': ['Poppins', 'sans-serif'],
        'cosmic': ['Orbitron', 'monospace'],
        'mystical': ['Cinzel', 'serif'],
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      },
      textShadow: {
        'cosmic': '0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)',
        'ethereal': '0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
        'mystical': '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(251, 191, 36, 0.4)',
        'glow': '0 0 5px rgba(255, 255, 255, 0.9), 0 0 10px rgba(251, 191, 36, 0.6), 0 0 15px rgba(251, 191, 36, 0.4)',
      },
    }
  },
  plugins: [
    require('tailwindcss-textshadow')
  ]
};
