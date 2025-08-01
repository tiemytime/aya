import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock all dependencies
vi.mock('@/hooks', () => ({
  useNewsEvents: () => ({
    data: { 
      data: { 
        events: [], 
        pagination: { page: 1, limit: 50, total: 0, pages: 0 } 
      } 
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/services', () => ({
  apiService: {
    getEventPrayerNotes: vi.fn().mockResolvedValue({
      data: { notes: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }
    })
  },
  PrayerNote: {},
}));

// Mock all dependencies
vi.mock('@/hooks', () => ({
  useNewsEvents: () => ({
    data: { 
      data: { 
        events: [], 
        pagination: { page: 1, limit: 50, total: 0, pages: 0 } 
      } 
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/utils', () => ({
  RealGlobe3D: vi.fn(() => ({
    clearEventMarkers: vi.fn(),
    addEventMarker: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispose: vi.fn(),
  })),
  getTimeAgo: () => '2h ago',
  getPriorityColor: () => '#FFD700',
}));

vi.mock('@/components/UI', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  AudioPlayer: () => <div data-testid="audio-player">Audio Player</div>,
  LoadingSpinner: ({ message }: { message?: string }) => <div data-testid="loading-spinner">{message || 'Loading...'}</div>,
}));

vi.mock('@/components/Globe/Globe3D', () => ({
  default: () => <div data-testid="globe-3d">Globe3D Component</div>,
}));

import GlobePage from '../GlobePage';

describe('GlobePage', () => {
  const renderGlobePage = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <GlobePage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders without crashing', () => {
    renderGlobePage();
    // Should render the page container - check for the main container div
    expect(document.querySelector('.relative.w-full.h-screen')).toBeTruthy();
  });

  it('displays status indicator', () => {
    renderGlobePage();
    // Should render either the Live Data indicator or the audio player (part of status)
    const hasAudioPlayer = screen.queryByTestId('audio-player');
    const hasLiveData = screen.queryByText('Live Data');
    expect(hasAudioPlayer || hasLiveData).toBeTruthy();
  });
});
