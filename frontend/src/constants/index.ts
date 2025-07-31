// API Configuration
export const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
export const WS_URL = import.meta.env.REACT_APP_WS_URL || 'ws://localhost:3001';

// Globe Configuration
export const GLOBE_CONFIG = {
  AUTO_ROTATE: import.meta.env.REACT_APP_GLOBE_AUTO_ROTATE === 'true',
  ROTATION_SPEED: 0.002,
  ZOOM_LEVELS: {
    CLOSE: 1.5,
    MEDIUM: 2.5,
    FAR: 4.0,
  },
  MARKER_SIZES: {
    MIN: 0.02,
    MAX: 0.1,
  },
} as const;

// News Configuration
export const NEWS_CONFIG = {
  REFRESH_INTERVAL: parseInt(
    import.meta.env.REACT_APP_NEWS_REFRESH_INTERVAL || '300000',
    10
  ),
  MAX_EVENTS: parseInt(
    import.meta.env.REACT_APP_MAX_NEWS_EVENTS || '200',
    10
  ),
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 50,
  },
  CATEGORIES: [
    'politics',
    'economy',
    'disasters',
    'conflicts',
    'health',
    'environment',
    'technology',
    'sports',
    'entertainment',
  ],
} as const;

// Prayer Configuration
export const PRAYER_CONFIG = {
  STYLES: ['traditional', 'modern', 'personal'] as const,
  LENGTHS: ['short', 'medium', 'long'] as const,
  MAX_KEYWORDS: 5,
  MAX_INTENTION_LENGTH: 500,
  ENABLE_AUDIO: import.meta.env.REACT_APP_ENABLE_AUDIO_PRAYERS === 'true',
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  MODAL_Z_INDEX: 1000,
  TOAST_DURATION: 5000,
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  GLOBE: '/globe',
  PRAYER: {
    ROOT: '/prayer',
    SUBMIT: '/prayer/submit',
    CONFIRMATION: '/prayer/confirmation',
    WALL: '/prayer/wall',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
} as const;
