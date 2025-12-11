/**
 * @fileoverview Tool model schema
 * @description Defines the AI Tool schema for the tools directory
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Tool Schema Definition
 */
const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: [true, 'Tool URL is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['writing', 'image', 'video', 'audio', 'coding', 'productivity', 'research', 'marketing', 'data', 'chatbot', 'other'],
      message: 'Invalid category'
    }
  },
  pricing: {
    type: String,
    required: [true, 'Pricing is required'],
    enum: {
      values: ['free', 'freemium', 'paid'],
      message: 'Pricing must be free, freemium, or paid'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Index for filtering
toolSchema.index({ category: 1, pricing: 1, featured: 1 });

module.exports = mongoose.model('Tool', toolSchema);
