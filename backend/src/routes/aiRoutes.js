const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { z } = require('zod');

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(authMiddleware.protect);

// Validation schemas
const generatePrayerSchema = z.object({
  userIntent: z.string()
    .min(5, 'User intent must be at least 5 characters long')
    .max(500, 'User intent must be at most 500 characters long')
    .trim(),
  keywords: z.array(z.string().max(50, 'Each keyword must be at most 50 characters long'))
    .optional()
    .default([]),
  theme: z.string()
    .max(100, 'Theme must be at most 100 characters long')
    .optional()
    .default(''),
  length: z.enum(['short', 'medium', 'long'])
    .optional()
    .default('medium'),
  language: z.string()
    .max(50, 'Language must be at most 50 characters long')
    .optional()
    .default('English'),
  generateAudio: z.boolean()
    .optional()
    .default(false),
  voiceId: z.string()
    .optional(),
});

const prayerHistoryQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a positive number')
    .transform(Number)
    .optional()
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a positive number')
    .transform(Number)
    .refine(val => val <= 50, 'Limit cannot exceed 50')
    .optional()
    .default('10'),
  theme: z.string()
    .max(100, 'Theme filter must be at most 100 characters long')
    .optional(),
});

// AI Prayer Generation Routes

/**
 * POST /api/ai/generate-prayer
 * Generate a new prayer with optional audio
 */
router.post('/generate-prayer',
  validationMiddleware(generatePrayerSchema, 'body'),
  aiController.generatePrayer
);

/**
 * GET /api/ai/prayers
 * Get user's prayer history with pagination and optional filtering
 */
router.get('/prayers',
  validationMiddleware(prayerHistoryQuerySchema, 'query'),
  aiController.getPrayerHistory
);

/**
 * GET /api/ai/prayers/:prayerId
 * Get a specific prayer by ID
 */
router.get('/prayers/:prayerId',
  aiController.getPrayerById
);

/**
 * DELETE /api/ai/prayers/:prayerId
 * Delete a specific prayer
 */
router.delete('/prayers/:prayerId',
  aiController.deletePrayer
);

module.exports = router;
