const mongoose = require('mongoose');

const generatedPrayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  userIntent: {
    type: String,
    required: [true, 'User intent is required'],
    trim: true,
    maxlength: [500, 'User intent must be at most 500 characters long'],
  },
  theme: {
    type: String,
    trim: true,
    maxlength: [100, 'Theme must be at most 100 characters long'],
    default: '',
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each keyword must be at most 50 characters long'],
  }],
  language: {
    type: String,
    default: 'English',
    maxlength: [50, 'Language must be at most 50 characters long'],
  },
  length: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium',
  },
  generatedText: {
    type: String,
    required: [true, 'Generated prayer text is required'],
    trim: true,
  },
  audioGenerated: {
    type: Boolean,
    default: false,
  },
  voiceId: {
    type: String,
    trim: true,
  },
  s3FileUrl: {
    type: String,
    trim: true,
  },
  s3Key: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
generatedPrayerSchema.index({ userId: 1, createdAt: -1 });
generatedPrayerSchema.index({ theme: 1, createdAt: -1 });

const GeneratedPrayer = mongoose.model('GeneratedPrayer', generatedPrayerSchema);

module.exports = GeneratedPrayer;
