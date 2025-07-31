const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name must be at most 50 characters long'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be at most 500 characters long'],
    default: '',
  },
  isPredefined: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
categorySchema.index({ name: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
