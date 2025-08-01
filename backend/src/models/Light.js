const mongoose = require('mongoose');

const lightSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Light location is required'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Light must have a creator'],
  },
  // Optional additional fields for enhanced functionality
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title must be at most 100 characters long'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description must be at most 1000 characters long'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  prayerCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  // References to Event and PrayerNote
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  prayerNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrayerNote',
  },
}, {
  timestamps: true,
});

// Index for better query performance
lightSchema.index({ createdBy: 1, timestamp: -1 });
lightSchema.index({ location: 1, timestamp: -1 });

const Light = mongoose.model('Light', lightSchema);

module.exports = Light;
