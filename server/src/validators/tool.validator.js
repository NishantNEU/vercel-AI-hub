/**
 * @fileoverview Tool request validators
 * @description Validation rules for tool endpoints
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { body, param, query } = require('express-validator');

// Valid categories
const VALID_CATEGORIES = ['writing', 'image', 'video', 'audio', 'coding', 'productivity', 'research', 'marketing', 'data', 'chatbot', 'other'];

// Valid pricing options
const VALID_PRICING = ['free', 'freemium', 'paid'];

/**
 * Validation for creating a tool
 */
const createToolValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tool name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('url')
    .trim()
    .notEmpty()
    .withMessage('Tool URL is required')
    .isURL()
    .withMessage('Please provide a valid URL'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

  body('pricing')
    .trim()
    .notEmpty()
    .withMessage('Pricing is required')
    .isIn(VALID_PRICING)
    .withMessage(`Pricing must be one of: ${VALID_PRICING.join(', ')}`),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('logo')
    .optional()
    .trim(),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
];

/**
 * Validation for updating a tool
 */
const updateToolValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid tool ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),

  body('category')
    .optional()
    .trim()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

  body('pricing')
    .optional()
    .trim()
    .isIn(VALID_PRICING)
    .withMessage(`Pricing must be one of: ${VALID_PRICING.join(', ')}`),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
];

/**
 * Validation for tool ID parameter
 */
const toolIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid tool ID')
];

/**
 * Validation for listing tools with filters
 */
const listToolsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Invalid category`),

  query('pricing')
    .optional()
    .isIn(VALID_PRICING)
    .withMessage(`Invalid pricing`),

  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  query('search')
    .optional()
    .trim()
];

module.exports = {
  createToolValidator,
  updateToolValidator,
  toolIdValidator,
  listToolsValidator
};
