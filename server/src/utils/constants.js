/**
 * @fileoverview Application-wide constants and enumerations
 * @description Centralizes all magic strings, numbers, and configuration values
 * for maintainability and consistency across the application.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

/**
 * User role enumeration
 * @readonly
 * @enum {string}
 */
const USER_ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
});

/**
 * HTTP status codes used in API responses
 * @readonly
 * @enum {number}
 */
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
});

/**
 * AI model identifiers for the chat hub
 * @readonly
 * @enum {string}
 */
const AI_MODELS = Object.freeze({
  GEMINI_FLASH: 'gemini-1.5-flash',
  GEMINI_PRO: 'gemini-1.5-pro'
});

/**
 * Chat mode types for different AI behaviors
 * @readonly
 * @enum {string}
 */
const CHAT_MODES = Object.freeze({
  GENERAL: 'general',
  TUTOR: 'tutor',
  CODER: 'coder',
  SUMMARIZER: 'summarizer'
});

/**
 * AI tool categories for the directory
 * @readonly
 * @enum {string}
 */
const TOOL_CATEGORIES = Object.freeze({
  WRITING: 'writing',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  CODING: 'coding',
  PRODUCTIVITY: 'productivity',
  RESEARCH: 'research',
  MARKETING: 'marketing',
  DATA: 'data',
  OTHER: 'other'
});

/**
 * Tool pricing models
 * @readonly
 * @enum {string}
 */
const TOOL_PRICING = Object.freeze({
  FREE: 'free',
  FREEMIUM: 'freemium',
  PAID: 'paid'
});

/**
 * Course difficulty levels
 * @readonly
 * @enum {string}
 */
const COURSE_DIFFICULTY = Object.freeze({
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
});

/**
 * Pagination defaults
 * @readonly
 * @enum {number}
 */
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
});

/**
 * Rate limiting configuration
 * @readonly
 */
const RATE_LIMIT = Object.freeze({
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,         // requests per window
  AI_MAX_REQUESTS: 20        // AI endpoints per window
});

/**
 * JWT configuration defaults
 * @readonly
 */
const JWT_CONFIG = Object.freeze({
  DEFAULT_EXPIRY: '7d',
  REFRESH_EXPIRY: '30d'
});

/**
 * File upload configuration
 * @readonly
 */
const UPLOAD_CONFIG = Object.freeze({
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf']
});

/**
 * Standard API response messages
 * @readonly
 */
const MESSAGES = Object.freeze({
  // Success messages
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  
  // Auth messages
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful',
  
  // Error messages
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  RATE_LIMIT: 'Too many requests, please try again later',
  
  // User messages
  USER_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found'
});

module.exports = {
  USER_ROLES,
  HTTP_STATUS,
  AI_MODELS,
  CHAT_MODES,
  TOOL_CATEGORIES,
  TOOL_PRICING,
  COURSE_DIFFICULTY,
  PAGINATION,
  RATE_LIMIT,
  JWT_CONFIG,
  UPLOAD_CONFIG,
  MESSAGES
};
