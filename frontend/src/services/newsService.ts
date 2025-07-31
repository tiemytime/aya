import { NewsEventsResponse, NewsEvent } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * News API service for fetching news events
 */
export class NewsService {
  /**
   * Fetch news events from the backend
   */
  static async getNewsEvents(limit = 50): Promise<NewsEventsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/globe?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news events:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific news event by ID
   */
  static async getNewsEvent(id: string): Promise<{ success: boolean; data: { event: NewsEvent } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news event:', error);
      throw error;
    }
  }
}
