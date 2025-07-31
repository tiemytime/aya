const mongoose = require('mongoose');

const lightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Light title is required'],
    trim: true,
    maxlength: [100, 'Title must be at most 100 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Light description is required'],
    trim: true,
    maxlength: [1000, 'Description must be at most 1000 characters long'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Light must have a creator'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Light must have a category'],
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
}, {
  timestamps: true,
});

// Index for better query performance
lightSchema.index({ createdBy: 1, createdAt: -1 });
lightSchema.index({ category: 1, status: 1 });

const Light = mongoose.model('Light', lightSchema);

module.exports = Light;
