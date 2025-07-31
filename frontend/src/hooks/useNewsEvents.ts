import { useState, useEffect, useCallback } from 'react';
import { NewsEventsResponse, NewsEvent } from '@/types';
import { NewsService } from '@/services';

/**
 * Hook for fetching and managing news events
 */
export function useNewsEvents(limit = 50) {
  const [data, setData] = useState<NewsEventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNewsEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await NewsService.getNewsEvents(limit);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNewsEvents();
  }, [fetchNewsEvents]);

  const refetch = useCallback(() => {
    fetchNewsEvents();
  }, [fetchNewsEvents]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching a single news event
 */
export function useNewsEvent(id: string) {
  const [data, setData] = useState<NewsEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNewsEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await NewsService.getNewsEvent(id);
        setData(response.data.event);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsEvent();
  }, [id]);

  return {
    data,
    isLoading,
    error,
  };
}
