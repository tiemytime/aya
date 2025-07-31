import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'gradient-green'
    | 'gradient-gold'
    | 'outline'
    | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component following Aya design system
 * Based on designs from page3.jpg and page5.jpg
 * Supports gradients for primary actions like 'Light your candle' and 'Generate Prayer'
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const sizeClasses = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-9 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8 text-base',
    icon: 'h-10 w-10',
  };

  const variantClasses = {
    default:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    primary:
      'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-md hover:shadow-lg transform hover:scale-105',
    secondary:
      'bg-[#f3f4f6] text-[#111827] hover:bg-[#e5e7eb] border border-[#d1d5db] shadow-sm hover:shadow-md',
    'gradient-green':
      'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95',
    'gradient-gold':
      'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black font-semibold hover:from-[#f59e0b] hover:to-[#d97706] shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95',
    outline:
      'border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md',
    ghost:
      'text-primary hover:bg-primary/10 hover:text-primary transition-colors',
  };

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };
export type { ButtonProps };
