import React from 'react';
import { Button } from '@/components/UI';

/**
 * ButtonDemo component to showcase different button variants
 * Based on the designs from page3.jpg and page5.jpg
 */
const ButtonDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-white">
      <h2 className="text-2xl font-bold text-[#111827]">Button Components</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#374151]">Standard Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#374151]">Gradient Variants (Featured)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient-green">Light Your Candle</Button>
          <Button variant="gradient-gold">Generate Prayer</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#374151]">Sizes</h3>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="primary">Small</Button>
          <Button size="default" variant="primary">Default</Button>
          <Button size="lg" variant="primary">Large</Button>
          <Button size="icon" variant="primary">🔮</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#374151]">States</h3>
        <div className="flex gap-4">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
};

export { ButtonDemo };
