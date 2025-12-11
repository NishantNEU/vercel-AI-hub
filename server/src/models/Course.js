/**
 * @fileoverview Course model schema
 * @description Defines Course schema with lessons and quizzes for Learn AI module
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Lesson Sub-Schema
 */
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String
  }]
}, { _id: true });

/**
 * Quiz Question Sub-Schema
 */
const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required']
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number, // Index of correct option (0-based)
    required: [true, 'Correct answer is required']
  },
  explanation: {
    type: String,
    default: ''
  }
}, { _id: true });

/**
 * Course Schema Definition
 */
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['ai-fundamentals', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'generative-ai', 'ai-tools', 'prompt-engineering', 'ai-ethics', 'other'],
      message: 'Invalid category'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Difficulty must be beginner, intermediate, or advanced'
    }
  },
  duration: {
    type: Number, // Total duration in minutes
    default: 0
  },
  lessons: [lessonSchema],
  quiz: [quizQuestionSchema],
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  instructor: {
    name: { type: String, default: 'AI Super Hub' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, difficulty: 1, isPublished: 1 });
courseSchema.index({ isFeatured: 1, enrollmentCount: -1 });

// Calculate total duration before saving
courseSchema.pre('save', function(next) {
  if (this.lessons && this.lessons.length > 0) {
    this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
