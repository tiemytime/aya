const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const prayerNoteRoutes = require('./prayerNoteRoutes');
const aiRoutes = require('./aiRoutes');
const newsRoutes = require('./newsRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/prayer', prayerNoteRoutes);
router.use('/ai', aiRoutes);
router.use('/news', newsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'iPray API is running successfully',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
