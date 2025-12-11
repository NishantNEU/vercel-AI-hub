/**
 * @fileoverview Enrollment model schema
 * @description Tracks user enrollment and progress in courses
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Enrollment Schema Definition Sorted by Fields
 */
const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizAttempts: [{
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: Number,
      isCorrect: Boolean
    }],
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bestQuizScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed'],
    default: 'enrolled'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure unique enrollment
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Index for querying user's enrollments
enrollmentSchema.index({ user: 1, status: 1 });

// Update progress based on completed lessons
enrollmentSchema.methods.updateProgress = function(totalLessons) {
  if (totalLessons > 0) {
    this.progress = Math.round((this.completedLessons.length / totalLessons) * 100);
    
    // Update status
    if (this.progress === 0) {
      this.status = 'enrolled';
    } else if (this.progress < 100) {
      this.status = 'in-progress';
    } else {
      this.status = 'completed';
      this.completedAt = new Date();
    }
  }
  return this.progress;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
