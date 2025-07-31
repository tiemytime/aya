const express = require('express');
const NewsController = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { body, param, query, validationResult } = require('express-validator');

const router = express.Router();

/**
 * Validation middleware for handling express-validator errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @route   GET /api/news/global
 * @desc    Fetch global news from external APIs
 * @access  Public (temporary for development)
 * @params  limit (optional) - Number of articles to fetch (default: 50)
 * @params  category (optional) - News category (default: 'general')
 */
router.get('/global', 
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('category')
      .optional()
      .isIn(['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'])
      .withMessage('Invalid category')
  ],
  handleValidationErrors,
  NewsController.fetchGlobalNews
);

/**
 * @route   GET /api/news/country/:country
 * @desc    Fetch news for a specific country
 * @access  Public (temporary for development)
 * @params  country - Country name (required)
 * @params  limit (optional) - Number of articles to fetch (default: 30)
 * @params  category (optional) - News category (default: 'general')
 */
router.get('/country/:country',
  [
    param('country')
      .notEmpty()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Country name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Country name can only contain letters and spaces'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('category')
      .optional()
      .isIn(['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'])
      .withMessage('Invalid category')
  ],
  handleValidationErrors,
  NewsController.fetchCountryNews
);

/**
 * @route   GET /api/news/events
 * @desc    Get stored news events from database
 * @access  Public (temporary for development)
 * @params  country (optional) - Filter by country
 * @params  limit (optional) - Number of events to fetch (default: 50)
 * @params  page (optional) - Page number for pagination (default: 1)
 * @params  sortBy (optional) - Field to sort by (default: 'published_at')
 * @params  order (optional) - Sort order 'asc' or 'desc' (default: 'desc')
 */
router.get('/events',
  [
    query('country')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Country name must be between 2 and 50 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('sortBy')
      .optional()
      .isIn(['published_at', 'priority', 'title', 'country', 'createdAt'])
      .withMessage('Invalid sort field'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc')
  ],
  handleValidationErrors,
  NewsController.getStoredEvents
);

/**
 * @route   GET /api/news/countries
 * @desc    Get list of supported countries
 * @access  Protected
 */
router.get('/countries',
  protect,
  NewsController.getSupportedCountries
);

/**
 * @route   GET /api/news/health
 * @desc    Health check endpoint for news service
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'News service is operational',
    timestamp: new Date().toISOString(),
    apis: {
      gnews: !!process.env.GNEWS_API_KEY,
      newsio: !!process.env.NEWS_IO_API_KEY
    }
  });
});

/**
 * @route   GET /api/news/globe
 * @desc    Get events with coordinates for Globe visualization
 * @access  Public
 * @params  limit (optional) - Number of events to fetch (default: 100)
 * @params  minPriority (optional) - Minimum priority level (default: 1)
 * @params  hours (optional) - Time range in hours (default: 24)
 */
router.get('/globe',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage('Limit must be between 1 and 500'),
    query('minPriority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
    query('hours')
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage('Hours must be between 1 and 168 (7 days)')
  ],
  handleValidationErrors,
  NewsController.getEventsForGlobe
);

module.exports = router;
