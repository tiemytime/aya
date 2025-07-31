const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category reference is required'],
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
});

// Compound unique index to prevent duplicate event-category pairs
eventCategorySchema.index({ event: 1, category: 1 }, { unique: true });

const EventCategory = mongoose.model('EventCategory', eventCategorySchema);

module.exports = EventCategory;
