import React from 'react';
import { Button } from '@/components/UI';

/**
 * Test component to showcase the enhanced cosmic button variants
 */
const ButtonShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-deep-space p-8 flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-elegant text-white text-shadow-cosmic mb-12">
        Enhanced Cosmic Button Showcase
      </h1>
      
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {/* Enhanced Gradient Gold Button */}
        <Button variant="cosmic-gold" size="lg" className="animate-breathe">
          Sacred Gold Action
        </Button>
        
        {/* Enhanced Gradient Green Button */}
        <Button variant="cosmic-green" size="lg" className="animate-breathe-slow">
          Ethereal Green Action
        </Button>
        
        {/* Disabled Gradient Gold Button */}
        <Button variant="cosmic-gold" size="lg" disabled>
          Disabled Gold
        </Button>
        
        {/* Disabled Gradient Green Button */}
        <Button variant="cosmic-green" size="lg" disabled>
          Disabled Green
        </Button>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-cosmic-moonlight font-modern text-sm">
          Hover over the buttons to see the enhanced glow and animation effects
        </p>
      </div>
    </div>
  );
};

export default ButtonShowcase;
