# Aya - 3D Globe News Visualization Platform

Aya is a modern web application that provides an interactive 3D globe visualization of global news events. Built with React, Node.js, and Three.js, it offers real-time news tracking with beautiful 3D visualization.

## 🌍 Features

- **Interactive 3D Globe**: Stunning Earth visualization with realistic textures and starfield background
- **Real-time News Events**: Live news events displayed as interactive markers on the globe
- **Advanced Visualization**: Shader-based Earth rendering with day/night cycles
- **News Details Panel**: Detailed event information with expandable panels
- **Responsive Design**: Modern, mobile-friendly interface
- **AI-Powered Insights**: OpenAI integration for enhanced content analysis
- **RESTful API**: Comprehensive backend API for news data management

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Three.js** for 3D graphics and WebGL rendering
- **TailwindCSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **OpenAI API** integration
- **JWT** authentication
- **Comprehensive error handling**

## 📦 Project Structure

```
aya_final/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── utils/         # Utility functions and 3D globe logic
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── controllers/   # API route controllers
│   │   ├── models/        # MongoDB data models
│   │   ├── routes/        # Express route definitions
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   └── package.json
├── Globe/             # Original 3D globe reference implementation
└── docs/              # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aya_final
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.development.example .env.development
# Edit .env.development with your configuration
```

### 4. Database Setup
```bash
# Start MongoDB (adjust port as needed)
mongod --port 27018 --dbpath /tmp/mongodb --bind_ip 127.0.0.1

# Add test data (optional)
cd backend
node add-test-data.js
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if not running):
```bash
mongod --port 27018 --dbpath /tmp/mongodb --bind_ip 127.0.0.1
```

2. **Start Backend Server**:
```bash
cd backend
npm start
```

3. **Start Frontend Development Server**:
```bash
cd frontend
npm run dev
```

4. **Access the Application**:
- Frontend: http://localhost:3001
- Globe Page: http://localhost:3001/globe
- Backend API: http://localhost:5000

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production npm start
```

## 🌐 API Endpoints

### News Events
- `GET /api/news/globe` - Get news events for globe visualization
- `GET /api/news` - Get paginated news events
- `POST /api/news` - Create new news event (authenticated)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)

### AI Features
- `POST /api/ai/generate-prayer` - Generate AI-powered content
- `GET /api/ai/suggestions` - Get AI suggestions

## 🎨 3D Globe Features

The globe implementation includes:
- **Realistic Earth Textures**: High-quality day/night Earth mapping
- **Starfield Background**: Dynamic star field with proper space visualization
- **Interactive Markers**: Click-able news event markers with priority-based sizing
- **Smooth Animations**: Fluid rotation and interaction animations
- **Performance Optimized**: Efficient rendering with WebGL

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb://localhost:27018/aya
NODE_ENV=development
PORT=5000
JWT_SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000
REACT_APP_GLOBE_AUTO_ROTATE=true
REACT_APP_NEWS_REFRESH_INTERVAL=60000
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Development Guidelines

1. **TypeScript**: All new code should use TypeScript with proper type definitions
2. **Error Handling**: Implement comprehensive error handling for all API calls
3. **Performance**: Optimize Three.js rendering and minimize re-renders
4. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
5. **Documentation**: Update documentation for any new features

## 🚀 Deployment

### Production Deployment
1. Build the frontend: `npm run build`
2. Configure production environment variables
3. Set up MongoDB with proper authentication
4. Deploy backend to your preferred hosting service
5. Serve frontend static files via CDN or static hosting

### Docker Deployment (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for excellent 3D graphics library
- OpenAI for AI integration capabilities
- React and Node.js communities for robust development frameworks
- NASA for Earth texture resources

## 📞 Support

For support, please contact [your-email] or create an issue in the repository.

---

**Built with ❤️ for global awareness and beautiful visualization**
