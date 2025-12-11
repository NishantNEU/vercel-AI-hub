/**
 * @fileoverview Chat request validators
 * @description Validation rules for chat endpoints
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { body, param, query } = require('express-validator');

// Valid AI models
const VALID_MODELS = ['gemini-2.0-flash', 'gemini-1.5-pro'];

// Valid chat modes
const VALID_MODES = ['general', 'tutor', 'coder', 'summarizer'];

/**
 * Validation for creating a new chat
 */
const createChatValidator = [
  body('model')
    .optional()
    .isIn(VALID_MODELS)
    .withMessage(`Model must be one of: ${VALID_MODELS.join(', ')}`),

  body('mode')
    .optional()
    .isIn(VALID_MODES)
    .withMessage(`Mode must be one of: ${VALID_MODES.join(', ')}`),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters')
];

/**
 * Validation for sending a message
 */
const sendMessageValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid chat ID'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 10000 })
    .withMessage('Message cannot exceed 10000 characters')
];

/**
 * Validation for chat ID parameter
 */
const chatIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid chat ID')
];

/**
 * Validation for listing chats
 */
const listChatsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('mode')
    .optional()
    .isIn(VALID_MODES)
    .withMessage(`Invalid mode`)
];

/**
 * Validation for updating chat title
 */
const updateChatValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid chat ID'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters')
];

module.exports = {
  createChatValidator,
  sendMessageValidator,
  chatIdValidator,
  listChatsValidator,
  updateChatValidator
};
