# AYA Backend - Node.js API Server



The AYA backend is a robust Node.js/Express API server that powers the global prayer platform. It provides RESTful endpoints for user authentication, AI-powered prayer generation, news event management, and community prayer sharing.

## 🏗️ Architecture Overview

```
backend/
├── src/
│   ├── app.js                 # Express application setup
│   ├── server.js              # Server entry point and database connection
│   ├── config/
│   │   ├── config.js          # Application configuration
│   │   └── db.js              # MongoDB connection setup
│   ├── controllers/
│   │   ├── aiController.js    # AI prayer generation logic
│   │   ├── authController.js  # Authentication endpoints
│   │   ├── newsController.js  # News events management
│   │   └── prayerNoteController.js  # Community prayers
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT token validation
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validationMiddleware.js  # Request validation
│   ├── models/
│   │   ├── User.js            # User account schema
│   │   ├── GeneratedPrayer.js # AI-generated prayers
│   │   ├── PrayerNote.js      # Community prayer notes
│   │   ├── Event.js           # News events for globe
│   │   ├── Light.js           # Virtual prayer lights
│   │   └── [other models]     # Additional schemas
│   ├── routes/
│   │   ├── index.js           # Main route aggregator
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── aiRoutes.js        # AI prayer routes
│   │   ├── newsRoutes.js      # News event routes
│   │   ├── prayerNoteRoutes.js # Prayer note routes
│   │   └── userRoutes.js      # User management routes
│   ├── schemas/
│   │   ├── userSchema.js      # User validation schemas
│   │   └── prayerNoteSchema.js # Prayer validation schemas
│   └── utils/
│       ├── AppError.js        # Custom error class
│       └── catchAsync.js      # Async error handling
├── .env                       # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
├── test-api.sh              # API testing script
└── test-ai-structure.sh     # AI endpoint testing
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v5+ recommended)
- npm package manager

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## ⚙️ Environment Configuration

Create a `.env` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/aya_database
DB_PASSWORD=your_mongodb_password

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# AWS S3 Configuration (for audio storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=aya-audio-files

# External API Keys
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "age": 25,
  "location": "New York, USA"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### AI Prayer Routes (`/api/ai`)

#### Generate Prayer
```http
POST /api/ai/generate-prayer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userIntent": "Peace for the world during difficult times",
  "theme": "peace",
  "language": "english",
  "length": "medium",
  "includeAudio": true,
  "voiceId": "default"
}
```

#### Get Prayer History
```http
GET /api/ai/prayers?page=1&limit=10&theme=peace
Authorization: Bearer <jwt_token>
```

#### Get Specific Prayer
```http
GET /api/ai/prayers/:prayerId
Authorization: Bearer <jwt_token>
```

#### Delete Prayer
```http
DELETE /api/ai/prayers/:prayerId
Authorization: Bearer <jwt_token>
```

### News Events Routes (`/api/news`)

#### Get News Events
```http
GET /api/news/events?country=US&limit=50
```

#### Get Specific Event
```http
GET /api/news/events/:eventId
```

#### Get Prayer Notes for Event
```http
GET /api/v1/events/:eventId/notes?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "_id": "note_id",
        "content": "Praying for peace and healing in this difficult time...",
        "userId": {
          "_id": "user_id",
          "name": "User Name"
        },
        "lightId": {
          "_id": "light_id",
          "title": "Prayer Light Title",
          "location": "New York, USA"
        },
        "likes": 5,
        "isPublic": true,
        "createdAt": "2025-07-31T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    },
    "event": {
      "_id": "event_id",
      "title": "Breaking News Event",
      "country": "United States"
    }
  }
}
```

### Prayer Notes Routes (`/api/prayers`)

#### Create Prayer Note
```http
POST /api/prayers/notes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Praying for healing and peace in our community",
  "isPublic": true,
  "lightId": "optional_light_id"
}
```

#### Get Public Prayer Notes
```http
GET /api/prayers/notes?page=1&limit=20&lightId=optional_light_id
```

#### Update Prayer Note
```http
PUT /api/prayers/notes/:noteId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Updated prayer content",
  "isPublic": false
}
```

#### Delete Prayer Note
```http
DELETE /api/prayers/notes/:noteId
Authorization: Bearer <jwt_token>
```

### Light Routes (`/api/lights`)

#### Create Light
```http
POST /api/lights
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "location": "San Francisco, CA, USA",
  "title": "Prayer for World Peace",
  "description": "Lighting a candle for peace and healing around the world",
  "isAnonymous": false
}
```

#### Create Light with Prayer Note
```http
POST /api/lights/with-prayer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "location": "San Francisco, CA, USA",
  "title": "Prayer for World Peace",
  "description": "Lighting a candle for peace and healing around the world",
  "isAnonymous": false,
  "eventId": "optional_event_id",
  "prayerContent": "I pray for peace, healing, and unity in our world. May this light shine hope into the darkness.",
  "prayerIsPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "light": {
      "_id": "light_id",
      "location": "San Francisco, CA, USA",
      "title": "Prayer for World Peace",
      "description": "Lighting a candle for peace and healing around the world",
      "createdBy": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "prayerNoteId": {
        "_id": "prayer_note_id",
        "content": "I pray for peace, healing, and unity in our world...",
        "isPublic": true
      },
      "timestamp": "2025-07-31T12:00:00.000Z",
      "status": "active",
      "isAnonymous": false,
      "prayerCount": 0
    },
    "prayerNote": {
      "_id": "prayer_note_id",
      "content": "I pray for peace, healing, and unity in our world...",
      "lightId": {
        "_id": "light_id",
        "title": "Prayer for World Peace",
        "location": "San Francisco, CA, USA"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "isPublic": true,
      "likes": 0,
      "createdAt": "2025-07-31T12:00:00.000Z"
    },
    "lightId": "light_id",
    "prayerNoteId": "prayer_note_id"
  },
  "message": "Light and prayer note created successfully"
}
```

#### Get All Lights
```http
GET /api/lights?page=1&limit=10&location=New York&status=active
```

#### Get Specific Light
```http
GET /api/lights/:lightId
```

#### Get My Lights
```http
GET /api/lights/my/lights?page=1&limit=10&status=active
Authorization: Bearer <jwt_token>
```

#### Update Light
```http
PUT /api/lights/:lightId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Prayer Title",
  "description": "Updated prayer description",
  "status": "completed"
}
```

#### Delete Light
```http
DELETE /api/lights/:lightId
Authorization: Bearer <jwt_token>
```

### User Management Routes (`/api/users`)

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "New Location",
  "age": 26
}
```

## 🗄️ Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  age: Number (optional),
  location: String (optional),
  preferences: {
    defaultLanguage: String,
    prayerLength: String,
    voiceId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Generated Prayer Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  userIntent: String (required),
  theme: String (optional),
  keywords: [String],
  language: String (default: 'english'),
  length: String (enum: ['short', 'medium', 'long']),
  generatedText: String (required),
  audioGenerated: Boolean (default: false),
  voiceId: String (optional),
  s3FileUrl: String (optional),
  s3Key: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Prayer Note Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  content: String (required, 5-500 chars),
  lightId: ObjectId (ref: Light, optional),
  isPublic: Boolean (default: true),
  likes: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Schema (News Events)
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  country: String (required),
  latitude: Number (required),
  longitude: Number (required),
  priority: Number (1-10),
  source: String,
  source_url: String,
  external_id: String (unique),
  eventType: String (default: 'news_event'),
  published_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Light Schema (Virtual Prayer Lights)
```javascript
{
  _id: ObjectId,
  location: String (required), // Location where light is created
  timestamp: Date (default: Date.now), // When the light was created
  createdBy: ObjectId (ref: User, required), // User who created the light
  
  // Optional enhanced fields
  title: String (optional, max 100 chars),
  description: String (optional, max 1000 chars),
  category: ObjectId (ref: Category, optional),
  status: String (enum: ['active', 'completed', 'cancelled'], default: 'active'),
  prayerCount: Number (default: 0, min: 0),
  isAnonymous: Boolean (default: false),
  
  // Cross-model references
  eventId: ObjectId (ref: Event, optional), // Associated news event
  prayerNoteId: ObjectId (ref: PrayerNote, optional), // Associated prayer note
  
  // Automatically added by timestamps: true
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Token Expiration**: Configurable token lifetime
- **Protected Routes**: Middleware-based route protection

### Data Validation
- **Zod Schemas**: Runtime type checking and validation
- **Input Sanitization**: Prevent malicious data injection
- **Request Size Limits**: Prevent oversized requests
- **Email Validation**: Proper email format checking

### Rate Limiting & Security Headers
- **Request Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Controlled cross-origin access
- **Error Handling**: Secure error messages (no sensitive data leaks)

## 🧪 Testing

### API Testing Scripts

#### Test All API Endpoints
```bash
# Make executable
chmod +x test-api.sh

# Run comprehensive API test
./test-api.sh
```

#### Test AI Structure
```bash
# Make executable
chmod +x test-ai-structure.sh

# Test AI endpoints
./test-ai-structure.sh
```

#### Test Light API
```bash
# Make executable
chmod +x test-light-api.sh

# Test Light endpoints
./test-light-api.sh
```

#### Manual Testing with curl
```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Create a light (requires auth token)
curl -X POST http://localhost:5000/api/lights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"location":"New York, USA","title":"Prayer for Peace"}'

# Get all lights
curl -X GET http://localhost:5000/api/lights?limit=10
```

## 🔧 Development

### Adding New Endpoints

1. **Create Controller Function**
   ```javascript
   // src/controllers/newController.js
   const catchAsync = require('../utils/catchAsync');
   
   exports.newEndpoint = catchAsync(async (req, res, next) => {
     // Your logic here
     res.status(200).json({
       success: true,
       data: { /* your data */ }
     });
   });
   ```

2. **Add Route Definition**
   ```javascript
   // src/routes/newRoutes.js
   const express = require('express');
   const { newEndpoint } = require('../controllers/newController');
   const authMiddleware = require('../middleware/authMiddleware');
   
   const router = express.Router();
   router.post('/endpoint', authMiddleware, newEndpoint);
   
   module.exports = router;
   ```

3. **Register Route in Main Router**
   ```javascript
   // src/routes/index.js
   const newRoutes = require('./newRoutes');
   router.use('/new', newRoutes);
   ```

### Database Migrations

When adding new fields to existing models:

1. **Update Model Schema**
2. **Add Default Values** for existing documents
3. **Test with Existing Data**
4. **Document Changes** in this README

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT secret (32+ characters)
- [ ] Configure AWS S3 credentials
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure SSL certificates
- [ ] Set up backup strategy

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aya_production
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📊 Monitoring & Logging

### Health Check Endpoint
```http
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-07-31T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

### Error Logging
- All errors are logged with stack traces
- Database connection issues are monitored
- API response times can be tracked
- User authentication attempts are logged

## 🤝 Contributing

### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Follow camelCase naming convention
- Add JSDoc comments for functions
- Use meaningful variable names
- Handle errors appropriately

### Testing Requirements
- Add tests for new endpoints
- Test both success and error cases
- Validate input data thoroughly
- Test authentication middleware

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

**Need help?** Check the main project [README](../README.md) or create an issue in the repository.
