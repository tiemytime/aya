const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title must be at most 200 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description must be at most 2000 characters long'],
  },
  
  // Event Type - distinguishes between user events and news events
  eventType: {
    type: String,
    enum: ['user_event', 'news_event'],
    default: 'user_event',
    required: true,
  },
  
  // User Event Fields
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.eventType === 'user_event';
    },
  },
  startDate: {
    type: Date,
    required: function() {
      return this.eventType === 'user_event';
    },
  },
  endDate: {
    type: Date,
    required: function() {
      return this.eventType === 'user_event';
    },
    validate: {
      validator: function(value) {
        if (this.eventType === 'user_event' && value) {
          return value > this.startDate;
        }
        return true;
      },
      message: 'End date must be after start date',
    },
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location must be at most 200 characters long'],
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  meetingLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        // Only validate if isOnline is true and meetingLink is provided
        if (this.isOnline && value) {
          const urlPattern = /^https?:\/\/.+/;
          return urlPattern.test(value);
        }
        return true;
      },
      message: 'Please provide a valid meeting link URL',
    },
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // News Event Fields
  source: {
    type: String,
    required: function() {
      return this.eventType === 'news_event';
    },
    trim: true,
  },
  source_url: {
    type: String,
    required: function() {
      return this.eventType === 'news_event';
    },
    trim: true,
  },
  published_at: {
    type: Date,
    required: function() {
      return this.eventType === 'news_event';
    },
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  
  // Geographic coordinates for 3D globe visualization
  latitude: {
    type: Number,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
  },
  country: {
    type: String,
    trim: true,
  },
  
  // AI-generated prayer content
  generated_prayer_text: {
    type: String,
    trim: true,
  },
  generated_prayer_audio_url: {
    type: String,
    trim: true,
  },
  
  // External article ID for duplicate prevention
  external_id: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
eventSchema.index({ organizer: 1, startDate: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ country: 1, eventType: 1 });
eventSchema.index({ published_at: -1, eventType: 1 });
eventSchema.index({ external_id: 1 }, { sparse: true });
eventSchema.index({ latitude: 1, longitude: 1 });

// Compound index for news events geospatial queries
eventSchema.index({ 
  eventType: 1, 
  published_at: -1, 
  country: 1 
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
