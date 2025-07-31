const mongoose = require('mongoose');

const prayerNoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Prayer note content is required'],
    trim: true,
    minlength: [5, 'Content must be at least 5 characters long'],
    maxlength: [500, 'Content must be at most 500 characters long'],
  },
  lightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Light',
    required: [true, 'Prayer note must be associated with a light'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Prayer note must have an author'],
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
prayerNoteSchema.index({ lightId: 1, createdAt: -1 });
prayerNoteSchema.index({ userId: 1, createdAt: -1 });
prayerNoteSchema.index({ isPublic: 1, createdAt: -1 });

const PrayerNote = mongoose.model('PrayerNote', prayerNoteSchema);

module.exports = PrayerNote;
