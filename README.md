# AYA - A Universal Prayer Platform 🌍🕊️

AYA is a modern, full-stack web application that connects people worldwide through the power of prayer and intention. Built with cutting-edge web technologies, AYA offers an immersive 3D globe experience where users can visualize global news events, submit prayers, and participate in a global community of healing and hope.

## 🌟 Features

### Core Functionality
- **Interactive 3D Globe**: Navigate a beautiful, rotating Earth with real-time news events marked as interactive points
- **AI-Powered Prayer Generation**: Generate personalized prayers using advanced AI based on current global events or personal intentions
- **Community Prayer Wall**: Share and discover prayers from the global AYA community
- **Audio Prayer Experience**: Listen to generated prayers with high-quality text-to-speech
- **Real-time News Integration**: Stay informed about global events that may need prayer and attention
- **Multi-language Support**: Prayers can be generated in multiple languages
- **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile devices

### Technical Features
- **Modern React Frontend**: Built with React 19, TypeScript, and Vite for optimal performance
- **3D Visualization**: Three.js-powered interactive globe with smooth animations
- **RESTful API**: Comprehensive Node.js/Express backend with MongoDB integration
- **Real-time Updates**: Live data synchronization for news events and community prayers
- **Cloud Storage**: AWS S3 integration for audio file storage and delivery
- **Authentication & Security**: JWT-based authentication with secure user management
- **Data Validation**: Comprehensive validation using Zod schemas
- **Testing Suite**: Complete test coverage with Vitest and Testing Library

## 🏗️ Project Structure

```
aya_final/
├── README.md                 # This file
├── backend/                  # Node.js/Express API server
│   ├── src/                  # Backend source code
│   │   ├── app.js           # Express app configuration
│   │   ├── server.js        # Server entry point
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB/Mongoose models
│   │   ├── routes/          # API route definitions
│   │   ├── schemas/         # Validation schemas
│   │   └── utils/           # Utility functions
│   ├── package.json         # Backend dependencies
│   └── README.md           # Backend documentation
├── frontend/                # React web application
│   ├── src/                 # Frontend source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── constants/       # Application constants
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── README.md           # Frontend documentation
├── Globe/                   # Standalone 3D globe implementation
└── images/                  # Project images and assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v5+ recommended)
- npm or yarn package manager
- AWS S3 account (for audio storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd aya_final
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.development
   # Configure your environment variables
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/aya_database
DB_PASSWORD=your_mongodb_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# AWS S3 (for audio storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=aya-audio-files

# Server
PORT=5000
NODE_ENV=development

# External APIs
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Frontend Environment Variables
Create a `.env.development` file in the `frontend/` directory:
```env
# API Configuration
VITE_API_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000

# Feature Flags
REACT_APP_GLOBE_AUTO_ROTATE=true
REACT_APP_ENABLE_AUDIO_PRAYERS=true

# Performance
REACT_APP_NEWS_REFRESH_INTERVAL=60000
REACT_APP_MAX_NEWS_EVENTS=200
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start           # Production start
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run test:unit   # Run unit tests
npm run lint        # Check code quality
```

### Testing
```bash
# Frontend tests
cd frontend
npm run test:unit              # Run all tests
npm run test:unit:coverage     # Run with coverage

# Backend tests (when implemented)
cd backend
npm test
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### News Endpoints
- `GET /api/news/events` - Fetch news events for globe
- `GET /api/news/events/:id` - Get specific news event

### AI Prayer Endpoints
- `POST /api/ai/generate-prayer` - Generate AI prayer
- `GET /api/ai/prayers` - Get user's prayer history
- `GET /api/ai/prayers/:id` - Get specific prayer
- `DELETE /api/ai/prayers/:id` - Delete prayer

### Prayer Notes Endpoints
- `POST /api/prayers/notes` - Create prayer note
- `GET /api/prayers/notes` - Get public prayer notes
- `PUT /api/prayers/notes/:id` - Update prayer note
- `DELETE /api/prayers/notes/:id` - Delete prayer note

## 🏛️ Architecture

### Frontend Architecture
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** for styling
- **Three.js** for 3D globe visualization
- **Zod** for runtime type validation

### Backend Architecture
- **Node.js/Express** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **AWS S3** for file storage
- **Zod** for request validation
- **bcrypt** for password hashing

### Database Schema
- **Users**: User accounts and authentication
- **GeneratedPrayers**: AI-generated prayers with audio
- **PrayerNotes**: Community prayer submissions
- **Events**: News events for globe visualization
- **Lights**: Virtual candles/lights for prayers

## 🎨 Design System

The application follows a cosmic/spiritual design theme with:
- **Colors**: Deep space blues, celestial golds, pure whites
- **Typography**: Clean, readable fonts with spiritual elegance
- **Animations**: Smooth, peaceful transitions
- **Icons**: Minimalist spiritual and cosmic iconography
- **Layout**: Spacious, breathing room for contemplation

## 🌐 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build:production

# Backend
cd backend
npm start
```

### Environment Setup
- Configure production environment variables
- Set up MongoDB Atlas or production database
- Configure AWS S3 for file storage
- Set up domain and SSL certificates
- Configure CORS for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Follow the existing code style
- Update documentation for new features
- Ensure responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** for 3D visualization capabilities
- **OpenAI** for AI prayer generation technology
- **React Community** for the incredible ecosystem
- **MongoDB** for reliable data storage
- **All contributors** who help make AYA a platform for global connection and healing

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `backend/` and `frontend/` README files

---

**AYA - Connecting hearts and minds through prayer across the globe** 🌍💫
