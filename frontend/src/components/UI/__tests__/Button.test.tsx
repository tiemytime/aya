import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../ui/button';

describe('Button', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    const { getByRole } = render(<Button>Default Button</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('h-10', 'px-4', 'py-2');
  });

  it('applies primary variant classes correctly', () => {
    const { getByRole } = render(<Button variant="cosmic-primary">Primary Button</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('applies gradient-green variant classes correctly', () => {
    const { getByRole } = render(<Button variant="cosmic-green">Cosmic Green</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('applies gradient-gold variant classes correctly', () => {
    const { getByRole } = render(<Button variant="cosmic-gold">Cosmic Gold</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('applies large size classes correctly', () => {
    const { getByRole } = render(<Button size="lg">Large Button</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('h-11', 'px-8');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Clickable</Button>);
    
    await user.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('applies custom className', () => {
    const { getByRole } = render(<Button className="custom-class">Custom Button</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('supports different button types', () => {
    const { getByRole } = render(<Button type="submit">Submit Button</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
