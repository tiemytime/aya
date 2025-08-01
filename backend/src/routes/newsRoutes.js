const express = require('express');
const NewsController = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/zodValidation');
const {
  globalNewsQuerySchema,
  countryNewsParamsSchema,
  countryNewsQuerySchema,
  eventsQuerySchema,
  globeEventsQuerySchema,
  eventNotesParamsSchema,
  eventNotesQuerySchema
} = require('../schemas/newsSchema');

const router = express.Router();

/**
 * @route   GET /api/news/global
 * @desc    Fetch global news from external APIs
 * @access  Public (temporary for development)
 * @params  limit (optional) - Number of articles to fetch (default: 50)
 * @params  category (optional) - News category (default: 'general')
 */
router.get('/global', 
  validateRequest({ query: globalNewsQuerySchema }),
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
  validateRequest({ 
    params: countryNewsParamsSchema,
    query: countryNewsQuerySchema 
  }),
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
  validateRequest({ query: eventsQuerySchema }),
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
  validateRequest({ query: globeEventsQuerySchema }),
  NewsController.getEventsForGlobe
);

/**
 * @route   GET /api/v1/events/:eventId/notes
 * @desc    Get prayer notes for a specific event
 * @access  Public
 * @params  eventId - Event ID (required)
 * @params  page (optional) - Page number for pagination (default: 1)
 * @params  limit (optional) - Number of notes per page (default: 20)
 */
router.get('/v1/events/:eventId/notes',
  validateRequest({ 
    params: eventNotesParamsSchema,
    query: eventNotesQuerySchema 
  }),
  NewsController.getEventPrayerNotes
);

module.exports = router;
