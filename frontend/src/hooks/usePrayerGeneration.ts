import { useState, useEffect, useCallback } from 'react';
import { GeneratedPrayer, PrayerHistoryResponse } from '@/types/ai';
import { apiService } from '@/services';

/**
 * Hook for fetching prayer history with search functionality
 */
export function usePrayerHistory(page = 1, limit = 10, theme?: string, searchQuery?: string) {
  const [data, setData] = useState<PrayerHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrayerHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If there's a search query, use the search endpoint
      if (searchQuery && searchQuery.trim()) {
        const response = await apiService.searchPrayerNotes(searchQuery.trim(), page, limit);
        
        // Transform response to match expected format
        const transformedData: PrayerHistoryResponse = {
          status: 'success',
          data: {
            prayers: response.data.prayerNotes.map(note => ({
              _id: note._id,
              userId: note.userId?._id || '',
              userIntent: note.content,
              theme: note.lightId?.title || 'General',
              keywords: [],
              language: 'English',
              length: 'medium',
              generatedText: note.content,
              audioGenerated: false,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            })),
            pagination: response.pagination,
          },
        };
        
        setData(transformedData);
        return;
      }
      
      // Fall back to mock data when no search query or in development
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      const mockPrayers: GeneratedPrayer[] = [
        {
          _id: '1',
          userId: 'user1',
          userIntent: 'Peace in the world',
          theme: 'Environment',
          keywords: ['peace', 'world', 'harmony'],
          language: 'English',
          length: 'medium',
          generatedText: 'May peace flow through every corner of our world, bringing harmony to all living beings and healing to our precious Earth.',
          audioGenerated: false,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          _id: '2',
          userId: 'user2',
          userIntent: 'Healing for those in need',
          theme: 'Religion',
          keywords: ['healing', 'hope', 'compassion'],
          language: 'English',
          length: 'long',
          generatedText: 'Divine light, shine upon those who suffer and bring comfort to their hearts. May healing energy surround them with love and hope.',
          audioGenerated: true,
          s3FileUrl: 'https://example.com/prayer-audio.mp3',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z',
        },
        {
          _id: '3',
          userId: 'user3',
          userIntent: 'Strength for challenging times',
          theme: 'Last event',
          keywords: ['strength', 'courage', 'resilience'],
          language: 'English',
          length: 'short',
          generatedText: 'Grant us strength to face each day with courage and resilience, knowing that we are not alone in our journey.',
          audioGenerated: false,
          createdAt: '2024-01-13T08:20:00Z',
          updatedAt: '2024-01-13T08:20:00Z',
        },
        {
          _id: '4',
          userId: 'user4',
          userIntent: 'Unity among all peoples',
          theme: 'Most trend',
          keywords: ['unity', 'tolerance', 'understanding'],
          language: 'English',
          length: 'medium',
          generatedText: 'May we find unity in our diversity, building bridges of understanding and tolerance across all differences that divide us.',
          audioGenerated: true,
          s3FileUrl: 'https://example.com/prayer-audio-2.mp3',
          createdAt: '2024-01-12T20:10:00Z',
          updatedAt: '2024-01-12T20:10:00Z',
        },
        {
          _id: '5',
          userId: 'user5',
          userIntent: 'Protection for our planet',
          theme: 'Environment',
          keywords: ['environment', 'earth', 'protection'],
          language: 'English',
          length: 'medium',
          generatedText: 'Blessed Earth, we pray for your protection and healing. May we become better stewards of your precious gifts.',
          audioGenerated: false,
          createdAt: '2024-01-11T12:15:00Z',
          updatedAt: '2024-01-11T12:15:00Z',
        },
      ];

      // Filter by theme if provided
      const filteredPrayers = theme && theme !== 'All' 
        ? mockPrayers.filter(prayer => prayer.theme === theme)
        : mockPrayers;

      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPrayers = filteredPrayers.slice(startIndex, endIndex);

      const response: PrayerHistoryResponse = {
        status: 'success',
        data: {
          prayers: paginatedPrayers,
          pagination: {
            page,
            limit,
            total: filteredPrayers.length,
            pages: Math.ceil(filteredPrayers.length / limit),
          },
        },
      };

      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, theme, searchQuery]);

  useEffect(() => {
    fetchPrayerHistory();
  }, [fetchPrayerHistory]);

  const refetch = useCallback(() => {
    fetchPrayerHistory();
  }, [fetchPrayerHistory]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching public prayer notes
 * This would be used for the Wall of Prayers that shows community prayers
 */
export function usePrayerNotes(page = 1, limit = 10, _lightId?: string) {
  const [data, setData] = useState<{
    data: { prayerNotes: unknown[] };
    pagination: { page: number; limit: number; total: number; pages: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrayerNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock API call - replace with actual prayer notes API
      // This would call something like: apiService.getPrayerNotes(page, limit, lightId)
      // Currently lightId is not used in mock implementation
      console.log('LightId parameter available for future use:', _lightId);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, return empty data - implement when PrayerNote API is ready
      setData({
        data: {
          prayerNotes: [],
        },
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, _lightId]); // Include _lightId in dependencies

  useEffect(() => {
    fetchPrayerNotes();
  }, [fetchPrayerNotes]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPrayerNotes,
  };
}

/**
 * Hook for generating a prayer
 * Wraps the mutation logic for prayer generation
 */
export function useGeneratePrayer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePrayer = useCallback(async (request: {
    userIntent: string;
    eventId?: string;
    name?: string;
    email?: string;
    location?: string;
    age?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This would call apiService.generatePrayer(request)
      // For now, mock the response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse: GeneratedPrayer = {
        _id: Date.now().toString(),
        userId: '',
        userIntent: request.userIntent,
        theme: '',
        keywords: [],
        language: 'English',
        length: 'medium',
        generatedText: `A prayer has been generated for your intention: "${request.userIntent}". May this intention bring peace and healing to you and those around you. In this moment of connection, we join together in hope and love.`,
        audioGenerated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockResponse;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generatePrayer,
    isLoading,
    error,
  };
}
