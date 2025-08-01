const express = require('express');
const {
  createLight,
  getLights,
  getLight,
  updateLight,
  deleteLight,
  getMyLights,
  createLightWithPrayer,
} = require('../controllers/lightController');
const { protect } = require('../middleware/authMiddleware');
const { validateCreateLight, validateCreateLightWithPrayer } = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * Light Routes
 * Base route: /api/lights
 */

// Public routes
router.get('/', getLights); // Get all lights with pagination and filters
router.get('/:id', getLight); // Get a specific light by ID

// Protected routes (require authentication)
router.use(protect); // Apply auth middleware to all routes below

router.post('/', validateCreateLight, createLight); // Create a new light
router.post('/with-prayer', validateCreateLightWithPrayer, createLightWithPrayer); // Create light with prayer note
router.get('/my/lights', getMyLights); // Get user's own lights
router.put('/:id', updateLight); // Update a light (only by creator)
router.delete('/:id', deleteLight); // Delete a light (only by creator)

module.exports = router;
