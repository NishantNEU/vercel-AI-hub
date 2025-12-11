/**
 * @fileoverview Chat model schema
 * @description Stores AI chat conversations and messages
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');

/**
 * Message Sub-Schema
 */
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

/**
 * Chat Schema Definition
 */
const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat',
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
    model: {
    type: String,
    enum: ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'],
    default: 'gemini-2.0-flash'
    },
  mode: {
    type: String,
    enum: ['general', 'tutor', 'coder', 'summarizer'],
    default: 'general'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for user's chats
chatSchema.index({ user: 1, createdAt: -1 });

// Update message count before saving
chatSchema.pre('save', function(next) {
  this.messageCount = this.messages.length;
  next();
});

// Auto-generate title from first message
chatSchema.methods.generateTitle = function() {
  if (this.messages.length > 0) {
    const firstUserMessage = this.messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.substring(0, 50) + 
        (firstUserMessage.content.length > 50 ? '...' : '');
    }
  }
};

module.exports = mongoose.model('Chat', chatSchema);
