const express = require('express');
const prayerNoteController = require('../controllers/prayerNoteController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { createPrayerNoteSchema } = require('../schemas/prayerNoteSchema');

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(authMiddleware.protect);

// Prayer note routes
router.post('/notes',
  validationMiddleware(createPrayerNoteSchema, 'body'),
  prayerNoteController.createPrayerNote
);

router.post('/notes/:noteId/like',
  prayerNoteController.likePrayerNote
);

router.get('/notes',
  prayerNoteController.getPrayerNotes
);

router.get('/my-notes',
  prayerNoteController.getUserPrayerNotes
);

router.get('/search',
  prayerNoteController.searchPrayerNotes
);

module.exports = router;
