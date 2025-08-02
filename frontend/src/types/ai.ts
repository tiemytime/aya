/**
 * AI-related types for the Aya application
 */

export interface GeneratedPrayer {
  _id: string;
  userId: string;
  userIntent: string;
  theme?: string;
  keywords: string[];
  language: string;
  length: 'short' | 'medium' | 'long';
  generatedText: string;
  audioGenerated: boolean;
  voiceId?: string;
  s3FileUrl?: string;
  s3Key?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePrayerRequest {
  userIntent: string;
  keywords?: string[];
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
  generateAudio?: boolean;
  voiceId?: string;
}

export interface GeneratePrayerResponse {
  status: 'success' | 'error';
  data: GeneratedPrayer;
  message?: string;
}

export interface PrayerHistoryResponse {
  status: 'success' | 'error';
  data: {
    prayers: GeneratedPrayer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}

