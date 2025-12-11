/**
 * @fileoverview Prompt Model
 * @description MongoDB schema for AI prompts library
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Prompt title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  
  template: {
    type: String,
    required: [true, 'Prompt template is required'],
    trim: true
  },
  
  example: {
    type: String,
    required: [true, 'Example is required'],
    trim: true
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Learning',
      'Coding', 
      'Writing',
      'Creative',
      'Data & ML',
      'Business',
      'Research',
      'Productivity',
      'Career'
    ]
  },
  
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  color: {
    type: String,
    default: '#6c63ff'
  },
  
  icon: {
    type: String,
    default: 'Sparkles'
  },
  
  usageCount: {
    type: Number,
    default: 0
  },
  
  copyCount: {
    type: Number,
    default: 0
  },
  
  favoriteCount: {
    type: Number,
    default: 0
  },
  
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  aiModel: {
    type: String,
    enum: ['Any', 'ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E'],
    default: 'Any'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
promptSchema.index({ category: 1, isActive: 1 });
promptSchema.index({ tags: 1 });
promptSchema.index({ title: 'text', description: 'text', template: 'text' });
promptSchema.index({ isFeatured: 1, isActive: 1 });
promptSchema.index({ usageCount: -1 });

// Virtual for popularity score
promptSchema.virtual('popularityScore').get(function() {
  return (this.usageCount * 2) + (this.copyCount * 1) + (this.favoriteCount * 3);
});

// Static method to get prompts by category
promptSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort('-usageCount');
};

// Static method to get featured prompts
promptSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ isFeatured: true, isActive: true })
    .sort('-usageCount')
    .limit(limit);
};

// Static method to search prompts
promptSchema.statics.searchPrompts = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });
};

// Instance method to increment usage
promptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Instance method to increment copy count
promptSchema.methods.incrementCopy = function() {
  this.copyCount += 1;
  return this.save();
};

// Instance method to toggle favorite
promptSchema.methods.toggleFavorite = function(userId) {
  const index = this.favoritedBy.indexOf(userId);
  if (index === -1) {
    this.favoritedBy.push(userId);
    this.favoriteCount += 1;
  } else {
    this.favoritedBy.splice(index, 1);
    this.favoriteCount -= 1;
  }
  return this.save();
};

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
