import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from '../LandingPage';

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main heading correctly', () => {
    const { getByText } = renderWithRouter(<LandingPage />);
    expect(getByText('One prayer')).toBeInTheDocument();
    expect(getByText('One world')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    const { getByText } = renderWithRouter(<LandingPage />);
    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('displays Aya logo', () => {
    const { getByText } = renderWithRouter(<LandingPage />);
    expect(getByText('AYA')).toBeInTheDocument();
  });

  it('shows enter button after loading completes', async () => {
    const { getByText, queryByText } = renderWithRouter(<LandingPage />);
    
    // Initially should show loading
    expect(getByText('Loading')).toBeInTheDocument();
    
    // Wait for loading to complete and button to appear
    await waitFor(() => {
      expect(queryByText('Loading')).not.toBeInTheDocument();
      expect(getByText('Enter Application')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('navigates to globe page when enter button is clicked', async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithRouter(<LandingPage />);
    
    // Wait for button to appear
    await waitFor(() => {
      expect(getByText('Enter Application')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click the button
    await user.click(getByText('Enter Application'));
    
    // Check if navigate was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/globe');
  });

  it('calls onNavigateToGlobe prop when provided', async () => {
    const user = userEvent.setup();
    const mockOnNavigate = vi.fn();
    const { getByText } = renderWithRouter(
      <LandingPage onNavigateToGlobe={mockOnNavigate} />
    );
    
    // Wait for button to appear
    await waitFor(() => {
      expect(getByText('Enter Application')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click the button
    await user.click(getByText('Enter Application'));
    
    // Check if custom handler was called
    expect(mockOnNavigate).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders cosmic background elements', () => {
    const { container } = renderWithRouter(<LandingPage />);
    
    // Check for background gradients
    const backgroundDiv = container.querySelector('.bg-gradient-to-b');
    expect(backgroundDiv).toBeInTheDocument();
    
    // Check for stars (should have multiple star elements)
    const stars = container.querySelectorAll('.animate-pulse');
    expect(stars.length).toBeGreaterThan(50); // Should have many star elements
  });
});
