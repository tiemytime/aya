import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI';

interface LandingPageProps {
  onNavigateToGlobe?: () => void;
}

/**
 * LandingPage component - The main entry point of the Aya application
 * Features a cosmic starry background with the main tagline and navigation
 * Based on the design from page1.jpg
 */
const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToGlobe }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showEnterButton, setShowEnterButton] = useState(false);

  useEffect(() => {
    // Simulate loading sequence
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowEnterButton(true);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleEnter = () => {
    if (onNavigateToGlobe) {
      onNavigateToGlobe();
    } else {
      navigate('/globe');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Enhanced Multi-layer Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-deep-space">
        
        {/* Layer 1: Slow-moving distant stars */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(80)].map((_, i) => (
            <div
              key={`layer1-${i}`}
              className="absolute bg-white rounded-full animate-twinkle-slow"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            />
          ))}
        </div>

        {/* Layer 2: Medium-speed mid-distance stars */}
        <div className="absolute inset-0 opacity-50 animate-parallax-medium">
          {[...Array(60)].map((_, i) => (
            <div
              key={`layer2-${i}`}
              className="absolute bg-cosmic-moonlight rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 3 + 1.5}px`,
                height: `${Math.random() * 3 + 1.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* Layer 3: Fast-moving close stars */}
        <div className="absolute inset-0 opacity-70 animate-parallax-fast">
          {[...Array(40)].map((_, i) => (
            <div
              key={`layer3-${i}`}
              className="absolute bg-cosmic-starlight rounded-full animate-twinkle-fast"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>

        {/* Layer 4: Shooting stars */}
        <div className="absolute inset-0 opacity-60">
          {[...Array(8)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute bg-cosmic-solar-gold rounded-full animate-stellar-drift"
              style={{
                width: '2px',
                height: '2px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 25}s`,
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.9), 0 0 16px rgba(251, 191, 36, 0.6)',
              }}
            />
          ))}
        </div>
        
        {/* Enhanced Multi-layer Cosmic Glow Effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Primary cosmic glow - most pronounced */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-radial-pulse-intense opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(139, 92, 246, 0.3) 25%, rgba(59, 130, 246, 0.2) 50%, rgba(49, 46, 129, 0.1) 75%, transparent 100%)'
            }}
          />
          
          {/* Secondary ethereal glow */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-cosmic-breathe opacity-60"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.2) 30%, rgba(196, 181, 253, 0.1) 60%, transparent 80%)'
            }}
          />
          
          {/* Tertiary mystical aura */}
          <div 
            className="absolute w-[1000px] h-[1000px] rounded-full animate-aurora-slow opacity-40"
            style={{
              background: 'conic-gradient(from 0deg, rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1), rgba(251, 191, 36, 0.2))'
            }}
          />
        </div>

        {/* Nebula flow effect */}
        <div className="absolute inset-0 opacity-20 animate-nebula-flow"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.3) 25%, transparent 50%, rgba(251, 191, 36, 0.2) 75%, transparent 100%)',
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      {/* Aya Logo - Enhanced with glow */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cosmic-celestial-blue via-cosmic-spirit-purple to-cosmic-plasma-pink rounded transform rotate-45 shadow-glow-purple animate-glow-pulse-slow"></div>
          <span className="text-xl font-modern font-semibold tracking-wider text-shadow-cosmic">AYA</span>
        </div>
      </div>

      {/* Main content with enhanced typography */}
      <div className="relative z-10 text-center">
        <h1 className="font-elegant font-light tracking-wide leading-tight text-shadow-mystical">
          <span className="block text-6xl md:text-7xl lg:text-8xl animate-float-gentle">One prayer</span>
          <span className="block mt-4 text-6xl md:text-7xl lg:text-8xl animate-float-gentle" style={{ animationDelay: '1s' }}>One world</span>
        </h1>

        {/* Enhanced Loading indicator */}
        {isLoading && (
          <div className="mt-16 flex flex-col items-center animate-fade-in">
            <div className="flex space-x-2 mb-6">
              <div className="w-3 h-3 bg-cosmic-solar-gold rounded-full animate-glow-pulse shadow-glow-gold"></div>
              <div className="w-3 h-3 bg-cosmic-spirit-purple rounded-full animate-glow-pulse shadow-glow-purple" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-3 h-3 bg-cosmic-ethereal-cyan rounded-full animate-glow-pulse shadow-glow-blue" style={{ animationDelay: '0.6s' }}></div>
            </div>
            <p className="text-lg font-modern font-light tracking-widest text-shadow-mystical">Loading</p>
          </div>
        )}

        {/* Enhanced Enter button */}
        {showEnterButton && (
          <div className="mt-16 animate-fade-in">
            <Button
              variant="cosmic-gold"
              size="lg"
              onClick={handleEnter}
              className="px-12 py-5 text-lg font-modern font-medium tracking-wider shadow-glow-intense animate-breathe-gentle hover:shadow-glow-ethereal transition-all duration-500"
            >
              Enter the Sacred Space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
