const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User interaction must have a user'],
  },
  entityType: {
    type: String,
    required: [true, 'Entity type is required'],
    enum: ['Light', 'Event', 'PrayerNote', 'User', 'Category'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Entity ID is required'],
    // Dynamic reference based on entityType
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'view', 'like', 'unlike', 'comment', 'share', 
      'pray', 'join', 'leave', 'follow', 'unfollow',
      'create', 'update', 'delete'
    ],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Index for better query performance
userInteractionSchema.index({ userId: 1, timestamp: -1 });
userInteractionSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
userInteractionSchema.index({ userId: 1, action: 1, timestamp: -1 });

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;
