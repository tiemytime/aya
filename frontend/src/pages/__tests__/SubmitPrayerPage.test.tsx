import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SubmitPrayerPage from '../SubmitPrayerPage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {
        selectedEvent: {
          _id: 'test-event-1',
          title: 'Test Event',
          description: 'A test event for prayer submission',
          country: 'Test Country',
          latitude: 0,
          longitude: 0,
          priority: 8,
          published_at: '2025-01-01T00:00:00Z',
          source: 'Test Source',
          url: 'https://test.com',
          category: 'crisis',
        }
      }
    }),
  };
});

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
}));

describe('SubmitPrayerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSubmitPrayerPage = () => {
    return render(
      <BrowserRouter>
        <SubmitPrayerPage />
      </BrowserRouter>
    );
  };

  it('renders the prayer submission form', () => {
    renderSubmitPrayerPage();
    
    expect(screen.getByText('Write your intention here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your prayer intention...')).toBeInTheDocument();
    expect(screen.getByText('Light your candle')).toBeInTheDocument();
  });

  it('displays the selected event details', () => {
    renderSubmitPrayerPage();
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('A test event for prayer submission')).toBeInTheDocument();
    expect(screen.getByText('Test Country')).toBeInTheDocument();
  });

  it('shows character count for the intention textarea', () => {
    renderSubmitPrayerPage();
    
    const textarea = screen.getByPlaceholderText('Your prayer intention...');
    fireEvent.change(textarea, { target: { value: 'Test intention' } });
    
    expect(screen.getByText('14/500 character limit')).toBeInTheDocument();
  });

  it('validates form input and shows errors', async () => {
    renderSubmitPrayerPage();
    
    const submitButton = screen.getByText('Light your candle');
    
    // Try to submit without intention
    fireEvent.click(submitButton);
    
    // Should show validation error for empty intention
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when intention and location are provided', () => {
    renderSubmitPrayerPage();
    
    const textarea = screen.getByPlaceholderText('Your prayer intention...');
    const locationInput = screen.getByPlaceholderText('Location (required)');
    const submitButton = screen.getByText('Light your candle');
    
    // Initially disabled
    expect(submitButton).toBeDisabled();
    
    // Should still be disabled with only intention
    fireEvent.change(textarea, { target: { value: 'My prayer intention' } });
    expect(submitButton).toBeDisabled();
    
    // Should be enabled after providing both intention and location
    fireEvent.change(locationInput, { target: { value: 'New York, USA' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('renders optional and required form fields', () => {
    renderSubmitPrayerPage();
    
    expect(screen.getByPlaceholderText('Name (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location (required)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Age (optional)')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderSubmitPrayerPage();
    
    const backButton = screen.getByText('← Back to Globe');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders cosmic background elements', () => {
    renderSubmitPrayerPage();
    
    // Check for AYA logo
    expect(screen.getByText('AYA')).toBeInTheDocument();
    expect(screen.getByText('One prayer')).toBeInTheDocument();
    expect(screen.getByText('One world')).toBeInTheDocument();
    expect(screen.getByText('Wall of Prayers')).toBeInTheDocument();
  });
});
