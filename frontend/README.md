# AYA Frontend - React Web Application

The AYA frontend is a modern React application built with TypeScript, Vite, and cutting-edge web technologies. It provides an immersive 3D globe experience for visualizing global news events, generating AI-powered prayers, and connecting with a worldwide community of prayer.

## 🏗️ Architecture Overview

```
frontend/
├── src/
│   ├── App.tsx                # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles and Tailwind imports
│   ├── vite-env.d.ts         # Vite type definitions
│   ├── components/           # Reusable UI components
│   │   ├── index.ts          # Component exports
│   │   ├── Audio/           # Audio player components
│   │   │   ├── AudioPlayer.tsx    # Full-featured audio player
│   │   │   └── index.ts      # Audio component exports
│   │   ├── Globe/           # 3D globe components
│   │   │   ├── Globe3D.tsx   # Main globe component
│   │   │   └── index.ts      # Globe component exports
│   │   └── UI/              # Basic UI components
│   │       ├── Button.tsx    # Button component with variants
│   │       ├── AudioPlayer.tsx    # Simple audio player
│   │       ├── LoadingSpinner.tsx # Loading indicators
│   │       ├── ButtonDemo.tsx     # Button showcase
│   │       └── index.ts      # UI component exports
│   ├── pages/               # Page components
│   │   ├── index.ts         # Page exports
│   │   ├── LandingPage.tsx  # Welcome/home page
│   │   ├── GlobePage.tsx    # Interactive 3D globe
│   │   ├── SubmitPrayerPage.tsx   # Prayer submission form
│   │   ├── PrayerConfirmationPage.tsx # Prayer result display
│   │   ├── WallOfPrayersPage.tsx  # Community prayer wall
│   │   └── __tests__/       # Page component tests
│   ├── hooks/               # Custom React hooks
│   │   ├── index.ts         # Hook exports
│   │   ├── useNewsEvents.ts # News data fetching
│   │   └── usePrayerGeneration.ts # Prayer API hooks
│   ├── services/            # API service layer
│   │   ├── index.ts         # Service exports
│   │   ├── apiService.ts    # Main API client
│   │   └── newsService.ts   # News-specific API calls
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts         # Main type exports
│   │   ├── ai.ts           # AI/prayer related types
│   │   └── news.ts         # News event types
│   ├── utils/               # Utility functions
│   │   ├── index.ts         # Utility exports
│   │   ├── cn.ts           # Class name utility
│   │   ├── globe3d.ts      # Globe utilities
│   │   └── realGlobe3d.ts  # 3D globe implementation
│   ├── constants/           # Application constants
│   │   └── index.ts        # Configuration constants
│   └── test/               # Test setup and utilities
│       └── setup.ts        # Test environment setup
├── public/                 # Static assets
│   ├── vite.svg           # Vite logo
│   └── textures/          # 3D globe textures
│       └── earth.jpg      # Earth texture map
├── dist/                  # Production build output
├── node_modules/          # Dependencies
├── .env.development       # Development environment variables
├── .env.production        # Production environment variables
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Test runner configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TypeScript config
├── tsconfig.node.json     # Node-specific TypeScript config
├── eslint.config.js       # ESLint configuration
├── postcss.config.js      # PostCSS configuration
├── .prettierrc            # Prettier code formatting
├── .lintstagedrc.json     # Lint-staged configuration
└── .gitignore             # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager
- Modern web browser with WebGL support

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   - Development: http://localhost:5173
   - The app will automatically reload on code changes

## ⚙️ Environment Configuration

### Development Environment (`.env.development`)
```env
# API Configuration
VITE_API_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000

# WebSocket Configuration (if using real-time features)
REACT_APP_WS_URL=ws://localhost:5000

# Feature Flags
REACT_APP_GLOBE_AUTO_ROTATE=true
REACT_APP_ENABLE_AUDIO_PRAYERS=true

# Performance Settings
REACT_APP_NEWS_REFRESH_INTERVAL=60000
REACT_APP_MAX_NEWS_EVENTS=200

# Development Tools
REACT_APP_SENTRY_DSN=
REACT_APP_GTM_ID=
```

### Production Environment (`.env.production`)
```env
# Production API
VITE_API_URL=https://api.aya-platform.com
REACT_APP_API_URL=https://api.aya-platform.com

# WebSocket
REACT_APP_WS_URL=wss://api.aya-platform.com

# Optimized for production
REACT_APP_GLOBE_AUTO_ROTATE=false
REACT_APP_NEWS_REFRESH_INTERVAL=300000
REACT_APP_MAX_NEWS_EVENTS=100

# Analytics and Monitoring
REACT_APP_SENTRY_DSN=your_production_sentry_dsn
REACT_APP_GTM_ID=your_google_tag_manager_id
```

## 🎨 Component Library

### UI Components (`src/components/UI/`)

#### Button Component
```tsx
import { Button } from '@/components/UI';

// Basic usage
<Button onClick={handleClick}>Click me</Button>

// With variants
<Button variant="primary" size="large">Primary Action</Button>
<Button variant="gradient-green">Light your candle</Button>
<Button variant="gradient-gold">Generate Prayer</Button>

// Available variants
type ButtonVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'gradient-green' 
  | 'gradient-gold'

// Available sizes
type ButtonSize = 'small' | 'default' | 'large'
```

#### Loading Spinner
```tsx
import { LoadingSpinner } from '@/components/UI';

<LoadingSpinner message="Loading prayers..." />
<LoadingSpinner className="custom-styles" />
```

### Audio Components (`src/components/Audio/`)

#### Full Audio Player
```tsx
import { AudioPlayer } from '@/components/Audio';

<AudioPlayer 
  audioUrl="https://example.com/prayer.mp3"
  title="Peace Prayer"
  className="custom-player-styles"
/>
```

#### Prayer Audio Player
```tsx
import { PrayerAudioPlayer } from '@/components/Audio';

<PrayerAudioPlayer 
  generatedPrayer={prayerObject}
  onPlaybackComplete={handleComplete}
/>
```

### Globe Components (`src/components/Globe/`)

#### Globe3D Component
```tsx
import { Globe3D } from '@/components/Globe';

<Globe3D 
  newsEvents={newsEvents}
  onMarkerClick={handleMarkerClick}
  className="globe-container"
/>
```

## 📱 Pages & Routing

### Page Components (`src/pages/`)

#### Landing Page
- **Route**: `/`
- **Purpose**: Welcome screen with app introduction
- **Features**: Cosmic background, smooth animations, call-to-action

#### Globe Page
- **Route**: `/globe`
- **Purpose**: Interactive 3D Earth with news events
- **Features**: 
  - Three.js-powered 3D globe
  - Real-time news event markers
  - Clickable event details
  - Smooth zoom and rotation
  - Lazy-loaded for performance

#### Submit Prayer Page
- **Route**: `/submit-prayer`
- **Purpose**: AI prayer generation interface
- **Features**:
  - Form validation with Zod
  - AI-powered prayer generation
  - User preference settings
  - Audio generation options

#### Prayer Confirmation Page
- **Route**: `/prayer-confirmation`
- **Purpose**: Display generated prayer results
- **Features**:
  - Prayer text display
  - Audio playback controls
  - Sharing options
  - Save to personal collection

#### Wall of Prayers Page
- **Route**: `/wall-of-prayers`
- **Purpose**: Community prayer sharing
- **Features**:
  - Public prayer feed
  - Like and interaction features
  - Filtering options
  - Infinite scroll loading

## 🔧 Custom Hooks

### useNewsEvents Hook
```tsx
import { useNewsEvents } from '@/hooks';

const { data, isLoading, error, refetch } = useNewsEvents(limit);

// Returns:
// - data: NewsEventsResponse with events array
// - isLoading: boolean loading state
// - error: Error object if request fails
// - refetch: Function to manually refresh data
```

### usePrayerGeneration Hook
```tsx
import { useGeneratePrayer, usePrayerHistory } from '@/hooks';

// Generate new prayer
const generatePrayer = useGeneratePrayer();
await generatePrayer.mutateAsync({
  userIntent: "Peace for the world",
  theme: "peace",
  language: "english",
  length: "medium"
});

// Get prayer history
const { data: prayers } = usePrayerHistory(page, limit, theme);
```

## 🌐 API Integration

### API Service (`src/services/apiService.ts`)

The API service provides a centralized interface for all backend communication:

```tsx
import { apiService } from '@/services';

// Authentication
await apiService.login(email, password);
await apiService.register(userData);

// News events
const events = await apiService.getNewsEvents(params);

// AI prayers
const prayer = await apiService.generatePrayer(request);
const prayers = await apiService.getPrayerHistory(userId);

// Prayer notes
const notes = await apiService.getPrayerNotes(params);
await apiService.createPrayerNote(noteData);
```

### Type Safety
All API calls are fully typed with TypeScript interfaces:

```tsx
interface GeneratePrayerRequest {
  userIntent: string;
  theme?: string;
  language?: string;
  length?: 'short' | 'medium' | 'long';
  includeAudio?: boolean;
  voiceId?: string;
}

interface NewsEvent {
  _id: string;
  title: string;
  description: string;
  country: string;
  latitude: number;
  longitude: number;
  priority: number;
  published_at: string;
}
```

## 🎨 Styling & Design System

### Tailwind CSS Configuration
The project uses Tailwind CSS with custom design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        cosmic: {
          dark: '#0a0a0a',
          blue: '#1a365d',
          gold: '#fbbf24',
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
      }
    }
  }
}
```

### Design Principles
- **Cosmic Theme**: Dark backgrounds with celestial colors
- **Spiritual Aesthetics**: Peaceful, contemplative design
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Optimized animations and loading

### Component Styling Patterns
```tsx
// Using the cn utility for conditional classes
import { cn } from '@/utils';

<Button 
  className={cn(
    "base-button-styles",
    variant === "primary" && "primary-styles",
    isLoading && "loading-styles"
  )}
/>
```

## 🧪 Testing

### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);
afterEach(() => cleanup());
```

### Running Tests
```bash
# Run all tests
npm run test:unit

# Run tests with coverage
npm run test:unit:coverage

# Run tests in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- Button.test.tsx
```

### Test Examples
```tsx
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/UI';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔧 Development Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run preview               # Preview production build

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix             # Fix ESLint issues
npm run format               # Format code with Prettier
npm run format:check         # Check code formatting
npm run type-check           # TypeScript type checking

# Testing
npm run test:unit            # Run unit tests
npm run test:unit:coverage   # Run tests with coverage

# Build Variants
npm run build:staging        # Build for staging environment
npm run build:production     # Build for production environment
```

## 🏗️ Build & Deployment

### Production Build
```bash
# Create optimized production build
npm run build:production

# The build output will be in the `dist/` directory
# - Minified JavaScript and CSS
# - Optimized images and assets
# - Source maps for debugging
# - Gzipped for smaller file sizes
```

### Build Configuration (vite.config.ts)
```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            three: ['three'],
          },
        },
      },
    },
  };
});
```

### Deployment Checklist
- [ ] Build with production environment variables
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all environment variables are set
- [ ] Check that API endpoints are correct
- [ ] Test 3D globe performance
- [ ] Verify audio playback functionality
- [ ] Test responsive design on various devices

## 🎯 Performance Optimization

### Code Splitting
```tsx
// Lazy loading for better initial load performance
const LazyGlobe3D = lazy(() => import('@/components/Globe/Globe3D'));

<Suspense fallback={<LoadingSpinner message="Loading globe..." />}>
  <LazyGlobe3D {...props} />
</Suspense>
```

### Three.js Optimization
- **Lazy Loading**: Globe component loads only when needed
- **Efficient Rendering**: Optimized draw calls and geometry
- **Texture Optimization**: Compressed earth textures
- **Memory Management**: Proper cleanup of 3D objects

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Separate chunks for vendor libraries
- **Asset Optimization**: Compressed images and fonts
- **Gzip Compression**: Reduced file transfer sizes

## 🔧 Development Guidelines

### File Organization
- Group related files in feature directories
- Use index.ts files for clean imports
- Keep components small and focused
- Separate business logic into custom hooks

### Naming Conventions
- **Components**: PascalCase (e.g., `AudioPlayer.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useNewsEvents.ts`)
- **Types**: PascalCase interfaces (e.g., `NewsEvent`)
- **Files**: camelCase or kebab-case for utilities

### Code Style
- Use TypeScript for all components
- Prefer functional components with hooks
- Use explicit return types for functions
- Add JSDoc comments for complex logic
- Follow the configured ESLint and Prettier rules

### State Management
- Use React Query for server state
- Use React hooks for local component state
- Consider Context API for global app state
- Avoid prop drilling with proper component composition

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Follow TypeScript and ESLint rules
3. Write tests for new components
4. Update documentation as needed
5. Submit pull request with description

### Adding New Components
1. Create component file in appropriate directory
2. Add to index.ts exports
3. Write unit tests in `__tests__` directory
4. Update Storybook stories if available
5. Document props and usage examples

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route to React Router configuration
3. Add navigation links if needed
4. Write page tests
5. Update sitemap and documentation

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Query](https://tanstack.com/query/latest)

---

**Need help?** Check the main project [README](../README.md) or create an issue in the repository.
