/**
 * News Event types for the Aya application
 */

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  location: {
    country: string;
    region: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  relevance: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  sources: string[];
  links: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  success: boolean;
  data: {
    events: NewsEvent[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface GlobeEvent {
  id: string;
  event: NewsEvent;
  position: {
    x: number;
    y: number;
    z: number;
  };
  marker?: object; // Three.js marker object
}
