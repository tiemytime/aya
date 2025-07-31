const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a recipient'],
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: ['event_reminder', 'prayer_response', 'light_update', 'system_message', 'user_interaction'],
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message must be at most 500 characters long'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    // This can reference different models depending on the notification type
    // We don't set ref here as it's dynamic
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
});

// Index for better query performance
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
