/**
 * API Service for handling backend requests
 */

interface GeneratePrayerRequest {
  userIntent: string;
  eventId?: string;
  name?: string;
  email?: string;
  location?: string;
  age?: number;
}

interface GeneratePrayerResponse {
  id: string;
  content: string;
  userIntent: string;
  eventId?: string;
  audioUrl?: string;
  theme?: string;
  createdAt: string;
  userId?: string;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  /**
   * Generate a prayer using the AI service
   */
  async generatePrayer(request: GeneratePrayerRequest): Promise<ApiResponse<GeneratePrayerResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/generate-prayer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: In a real app, we'd include authentication headers here
        },
        body: JSON.stringify({
          userIntent: request.userIntent,
          // Map additional fields if needed by backend
          theme: request.eventId ? `Event: ${request.eventId}` : undefined,
          keywords: request.location ? [request.location] : [],
          length: 'medium',
          language: 'English',
          generateAudio: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend response to expected frontend format
      return {
        data: {
          id: data.id || Date.now().toString(),
          content: data.content || data.text || '',
          userIntent: request.userIntent,
          eventId: request.eventId,
          audioUrl: data.audioUrl,
          theme: data.theme,
          createdAt: data.createdAt || new Date().toISOString(),
          userId: data.userId,
        },
        status: 'success',
      };
    } catch (error) {
      console.error('Error generating prayer:', error);
      
      // Fallback to mock response if API is not available
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
        console.warn('API not available, using fallback mock response');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          data: {
            id: Date.now().toString(),
            content: `A prayer has been generated for your intention: "${request.userIntent}". May this intention bring peace and healing to you and those around you. In this moment of connection, we join together in hope and love.`,
            userIntent: request.userIntent,
            eventId: request.eventId,
            createdAt: new Date().toISOString(),
          },
          status: 'success',
          message: 'Generated using fallback service',
        };
      }
      
      throw error;
    }
  }

  /**
   * Check if the API service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { GeneratePrayerRequest, GeneratePrayerResponse, ApiResponse };
