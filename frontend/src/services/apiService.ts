/**
 * Comprehensive API Service for handling all backend requests
 * Based on docs/BACKEND_INTEGRATION.md sinterface UserResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      username?: string;
      bio?: string;
      profilePicture?: string;
      createdAt: string;
      updatedAt?: string;
    };
  };
}

// User update interfaces
interface UpdateUserRequest {
  username?: string;
  bio?: string;
  profilePicture?: string;
}

interface UpdateUserResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      username?: string;
      bio?: string;
      profilePicture?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
}

/**
 * Comprehensive API Service for handling all backend requests
 * Based on docs/BACKEND_INTEGRATION.md specifications
 */

import { GeneratedPrayer } from '../types/ai';

// ============================================================================
// REQUEST/RESPONSE INTERFACES
// ============================================================================

// News API Types
interface NewsEvent {
  _id: string;
  title: string;
  description: string;
  country: string;
  latitude: number;
  longitude: number;
  priority: number;
  published_at: string;
  source: string;
  source_url: string;
  eventType: 'news_event';
  external_id: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsEventsResponse {
  success: boolean;
  data: {
    events: NewsEvent[];
    total?: number;
    sources?: {
      gnews: boolean;
      newsi: boolean;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface NewsEventsParams {
  country?: string;
  limit?: number;
  page?: number;
  sortBy?: 'published_at' | 'priority' | 'title' | 'country';
  order?: 'asc' | 'desc';
}

// AI API Types
interface PrayerGenerationRequest {
  userIntent: string;
  keywords?: string[];
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
  generateAudio?: boolean;
  voiceId?: string;
}

interface PrayerGenerationResponse {
  status: 'success' | 'error';
  data: GeneratedPrayer;
}

interface PrayerHistoryResponse {
  success: boolean;
  data: {
    prayers: GeneratedPrayer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth API Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      name: string;
    };
    token: string;
  };
}

interface UserResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      name: string;
      createdAt: string;
    };
  };
}

// User profile update interfaces
interface UpdateUserRequest {
  name?: string;
  bio?: string;
  profilePicture?: string;
}

interface UpdateUserResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      name: string;
      bio?: string;
      profilePicture?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
}

// Prayer Notes API Types
interface CreatePrayerNoteRequest {
  content: string;
  isPublic: boolean;
  category?: string;
}

interface PrayerNote {
  _id: string;
  content: string;
  isPublic: boolean;
  category?: string;
  userId: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface PrayerNotesResponse {
  success: boolean;
  data: {
    notes: PrayerNote[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Search response for prayer notes (matches backend format)
interface PrayerNotesSearchResponse {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    prayerNotes: Array<{
      _id: string;
      content: string;
      likes: number;
      isPublic: boolean;
      createdAt: string;
      updatedAt: string;
      userId: {
        _id: string;
        username: string;
        profilePicture?: string;
      } | null;
      lightId: {
        _id: string;
        title: string;
        location: string;
      } | null;
    }>;
    query: string;
  };
}

// Light API Types
interface CreateLightWithPrayerRequest {
  location: string;
  title?: string;
  description?: string;
  isAnonymous?: boolean;
  eventId?: string;
  prayerContent: string;
  prayerIsPublic?: boolean;
}

interface Light {
  _id: string;
  location: string;
  timestamp: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  title?: string;
  description?: string;
  category?: string;
  status: 'active' | 'completed' | 'cancelled';
  prayerCount: number;
  isAnonymous: boolean;
  eventId?: string;
  prayerNoteId?: {
    _id: string;
    content: string;
    isPublic: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface PrayerNoteWithLight extends PrayerNote {
  lightId: {
    _id: string;
    title?: string;
    location: string;
  };
}

interface CreateLightWithPrayerResponse {
  success: boolean;
  data: {
    light: Light;
    prayerNote: PrayerNoteWithLight;
    lightId: string;
    prayerNoteId: string;
  };
  message: string;
}

// Legacy Types (for backward compatibility)
interface GeneratePrayerRequest {
  userIntent: string;
  eventId?: string;
  name?: string;
  email?: string;
  location?: string;
  age?: number;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// ============================================================================
// API SERVICE CLASS
// ============================================================================

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.token = localStorage.getItem('authToken');
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private setAuthToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  private clearAuthToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // ============================================================================
  // NEWS API METHODS
  // ============================================================================

  /**
   * Get global news events (hybrid NewsData.io + GNews)
   */
  async getGlobalNews(limit: number = 50, category: string = 'general'): Promise<NewsEventsResponse> {
    return this.request(`/api/news/global?limit=${limit}&category=${encodeURIComponent(category)}`);
  }

  /**
   * Get country-specific news events
   */
  async getCountryNews(country: string, limit: number = 30): Promise<NewsEventsResponse> {
    return this.request(`/api/news/country/${encodeURIComponent(country)}?limit=${limit}`);
  }

  /**
   * Get stored news events from database with pagination and filtering
   */
  async getNewsEvents(params: NewsEventsParams = {}): Promise<NewsEventsResponse> {
    const queryString = new URLSearchParams();
    
    if (params.country) queryString.append('country', params.country);
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.page) queryString.append('page', params.page.toString());
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.order) queryString.append('order', params.order);

    return this.request(`/api/news/events?${queryString.toString()}`);
  }

  /**
   * Get list of supported countries
   */
  async getCountries(): Promise<{ success: boolean; data: { countries: string[]; total: number } }> {
    return this.request('/api/news/countries');
  }

  /**
   * Check news service health
   */
  async getNewsHealth(): Promise<{ success: boolean; message: string; timestamp: string; apis: { gnews: boolean; newsi: boolean } }> {
    return this.request('/api/news/health');
  }

  // ============================================================================
  // AI API METHODS
  // ============================================================================

  /**
   * Generate prayer with optional audio using OpenAI + ElevenLabs
   */
  async generatePrayerAdvanced(request: PrayerGenerationRequest): Promise<PrayerGenerationResponse> {
    return this.request('/api/ai/generate-prayer', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get prayer history with pagination and filtering
   */
  async getPrayerHistory(page: number = 1, limit: number = 10, theme?: string): Promise<PrayerHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (theme) params.append('theme', theme);

    return this.request(`/api/ai/prayers?${params.toString()}`);
  }

  /**
   * Get specific prayer by ID
   */
  async getPrayerById(prayerId: string): Promise<{ success: boolean; data: GeneratedPrayer }> {
    return this.request(`/api/ai/prayers/${prayerId}`);
  }

  /**
   * Delete specific prayer by ID
   */
  async deletePrayer(prayerId: string): Promise<void> {
    return this.request(`/api/ai/prayers/${prayerId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // AUTHENTICATION API METHODS
  // ============================================================================

  /**
   * User login
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (response.success) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * User registration
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (response.success) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.request('/api/auth/me');
  }

  /**
   * Update user profile
   */
  async updateUserProfile(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.request('/api/v1/users/updateMe', {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get user's prayer notes (for profile page)
   */
  async getUserProfileNotes(page: number = 1, limit: number = 10): Promise<PrayerNotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request(`/api/v1/users/me/notes?${params.toString()}`);
  }

  /**
   * Logout user (clear token)
   */
  logout(): void {
    this.clearAuthToken();
  }

  // ============================================================================
  // PRAYER NOTES API METHODS
  // ============================================================================

  /**
   * Create a new prayer note
   */
  async createPrayerNote(request: CreatePrayerNoteRequest): Promise<{ success: boolean; data: PrayerNote }> {
    return this.request('/api/prayer/notes', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get user's prayer notes
   */
  async getUserPrayerNotes(page: number = 1, limit: number = 10): Promise<PrayerNotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request(`/api/prayer/my-notes?${params.toString()}`);
  }

  /**
   * Get public prayer notes (Wall of Prayers)
   */
  async getPublicPrayerNotes(page: number = 1, limit: number = 20, category?: string): Promise<PrayerNotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);

    return this.request(`/api/prayer/notes?${params.toString()}`);
  }

  /**
   * Get prayer notes for a specific event
   */
  async getEventPrayerNotes(eventId: string, page: number = 1, limit: number = 20): Promise<PrayerNotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request(`/api/v1/events/${eventId}/notes?${params.toString()}`);
  }

  /**
   * Search prayer notes by query
   */
  async searchPrayerNotes(query: string, page: number = 1, limit: number = 20): Promise<PrayerNotesSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request(`/api/prayer/search?${params.toString()}`);
  }

  // ============================================================================
  // LIGHT API METHODS
  // ============================================================================

  /**
   * Create a light with associated prayer note
   */
  async createLightWithPrayer(request: CreateLightWithPrayerRequest): Promise<CreateLightWithPrayerResponse> {
    return this.request('/api/lights/with-prayer', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // ============================================================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================================================

  /**
   * Legacy prayer generation method
   * @deprecated Use generatePrayerAdvanced instead
   */
  async generatePrayer(request: GeneratePrayerRequest): Promise<ApiResponse<GeneratedPrayer>> {
    try {
      // Map legacy request to new format
      const newRequest: PrayerGenerationRequest = {
        userIntent: request.userIntent,
        theme: request.eventId ? `Event: ${request.eventId}` : undefined,
        keywords: request.location ? [request.location] : [],
        length: 'medium',
        language: 'English',
        generateAudio: false,
      };

      const response = await this.generatePrayerAdvanced(newRequest);
      
      return {
        data: response.data,
        status: response.status,
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
            _id: Date.now().toString(),
            userId: '',
            userIntent: request.userIntent,
            theme: '',
            keywords: [],
            language: 'English',
            length: 'medium',
            generatedText: `A prayer has been generated for your intention: "${request.userIntent}". May this intention bring peace and healing to you and those around you. In this moment of connection, we join together in hope and love.`,
            audioGenerated: false,
            voiceId: '',
            s3FileUrl: '',
            s3Key: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

// ============================================================================
// EXPORTS
// ============================================================================

export const apiService = new ApiService();

export type {
  // News types
  NewsEvent,
  NewsEventsResponse,
  NewsEventsParams,
  
  // AI types
  PrayerGenerationRequest,
  PrayerGenerationResponse,
  PrayerHistoryResponse,
  
  // Auth types
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  
  // Prayer Notes types
  CreatePrayerNoteRequest,
  PrayerNote,
  PrayerNotesResponse,
  PrayerNotesSearchResponse,
  
  // Light types
  CreateLightWithPrayerRequest,
  Light,
  PrayerNoteWithLight,
  CreateLightWithPrayerResponse,
  
  // Legacy types
  GeneratePrayerRequest,
  ApiResponse,
};
