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
      {/* Cosmic starry background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111827] to-black">
        {/* Animated stars effect */}
        <div className="absolute inset-0 opacity-60">
          {/* Create multiple star layers for depth */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-96 h-96 rounded-full animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 25%, transparent 70%)'
            }}
          ></div>
        </div>
      </div>

      {/* Aya Logo - positioned top left like in the design */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#60a5fa] via-[#a855f7] to-[#ec4899] rounded transform rotate-45"></div>
          <span className="text-xl font-bold tracking-wider">AYA</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-wide leading-tight">
          <span className="block">One prayer</span>
          <span className="block mt-2">One world</span>
        </h1>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center animate-fade-in">
            <div className="flex space-x-1 mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-lg font-light tracking-widest">Loading</p>
          </div>
        )}

        {/* Enter button */}
        {showEnterButton && (
          <div className="mt-12 animate-fade-in">
            <Button
              variant="gradient-gold"
              size="lg"
              onClick={handleEnter}
              className="px-8 py-4 text-lg font-medium tracking-wider"
            >
              Enter Application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
