# iPray - Global Prayer Platform Backend

A Node.js backend application for the iPray platform, built with Express, MongoDB, and comprehensive authentication and validation systems.

## Features

- **Modular Monolithic Architecture**: Well-organized codebase with clear separation of concerns
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Data Validation**: Zod schemas for robust input validation
- **Error Handling**: Centralized error handling with custom error classes
- **Database Models**: Comprehensive Mongoose models for Users, Lights, Events, Prayer Notes, and more
- **RESTful API**: Clean and consistent API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ipray_lana
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/iPrayDB
JWT_SECRET_KEY=your_super_secret_jwt_key
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)

### Prayer Notes
- `POST /api/prayer/notes` - Create a prayer note (Protected)
- `GET /api/prayer/notes` - Get public prayer notes (Protected)
- `GET /api/prayer/my-notes` - Get user's prayer notes (Protected)
- `POST /api/prayer/notes/:note_id/like` - Like a prayer note (Protected)

### Health Check
- `GET /api/health` - API health check

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── schemas/         # Zod validation schemas
├── utils/           # Utility functions
├── app.js           # Express app setup
└── server.js        # Application entry point
```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
