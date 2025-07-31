const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { updateProfileSchema } = require('../schemas/userSchema');

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(authMiddleware.protect);

// User profile routes
router.get('/profile', authController.getProfile);

router.put('/profile',
  validationMiddleware(updateProfileSchema, 'body'),
  authController.updateProfile
);

module.exports = router;
