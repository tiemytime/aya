// News Event Types
export interface NewsEvent {
  _id: string;
  title: string;
  description: string;
  country: string;
  latitude: number;
  longitude: number;
  priority: number; // 1-10
  published_at: string;
  source: string;
  url: string;
  category?: string;
  imageUrl?: string;
}

export interface NewsEventsResponse {
  success: boolean;
  data: {
    events: NewsEvent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Prayer Types
export interface PrayerRequest {
  keywords: string[];
  intention: string;
  style?: 'traditional' | 'modern' | 'personal';
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedPrayer {
  _id: string;
  content: string;
  keywords: string[];
  generated_at: string;
  user_id?: string;
  audio_url?: string;
}

export interface Prayer {
  _id: string;
  content: string;
  author?: string;
  created_at: string;
  likes: number;
  category: string;
}

// Globe State Types
export interface GlobeState {
  zoomLevel: number;
  rotation: [number, number, number];
  autoRotate: boolean;
  selectedEvent: NewsEvent | null;
  filters: NewsFilters;
}

export interface NewsFilters {
  countries: string[];
  categories: string[];
  priority: [number, number];
  dateRange: [Date, Date];
}

// User Types
export interface User {
  _id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
}
