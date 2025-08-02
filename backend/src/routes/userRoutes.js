const express = require('express');
const authController = require('../controllers/authController');
const userInviteController = require('../controllers/userInviteController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { updateProfileSchema, inviteUserSchema } = require('../schemas/userSchema');

const router = express.Router();

// Public routes (no auth required)
router.get('/invite/:token', userInviteController.getInviteByToken);
router.post('/invite/:token/accept', userInviteController.acceptInvite);

// Apply protect middleware to all routes below this point
router.use(authMiddleware.protect);

// User profile routes
router.get('/profile', authController.getProfile);

router.put('/profile',
  validationMiddleware(updateProfileSchema, 'body'),
  authController.updateProfile
);

// User invitation routes (auth required)
router.post('/invite',
  validationMiddleware(inviteUserSchema, 'body'),
  userInviteController.sendInvite
);

router.get('/invites/sent', userInviteController.getSentInvites);

// Cancel invitation (auth required)
router.patch('/invite/:inviteId/cancel', userInviteController.cancelInvite);

module.exports = router;
