const express = require('express');
const cors = require('cors');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// Global middleware
// CORS middleware - allow all origins initially (configure for production)
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'App is working!' });
});

// Routes
app.use('/api', apiRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

module.exports = app;
