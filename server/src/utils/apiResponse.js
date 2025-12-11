/**
 * @fileoverview Standardized API response utilities
 * @description Provides consistent response formatting across all API endpoints.
 * Ensures every response follows the same structure for easy frontend consumption.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { HTTP_STATUS } = require('./constants');

/**
 * Standard API response structure
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indicates if the request was successful
 * @property {string} message - Human-readable message
 * @property {Object|null} data - Response payload (null on error)
 * @property {Object|null} error - Error details (null on success)
 * @property {Object} [meta] - Pagination or additional metadata
 */

/**
 * Sends a successful response
 * 
 * @function sendSuccess
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} [options.message='Success'] - Success message
 * @param {Object} [options.data=null] - Response data payload
 * @param {Object} [options.meta=null] - Additional metadata (pagination, etc.)
 * @returns {Object} Express response
 * 
 * @example
 * // Basic success response
 * sendSuccess(res, { message: 'User created', data: { user } });
 * 
 * @example
 * // Success with pagination
 * sendSuccess(res, {
 *   statusCode: 200,
 *   message: 'Users retrieved',
 *   data: { users },
 *   meta: { page: 1, limit: 10, total: 100 }
 * });
 */
const sendSuccess = (res, options = {}) => {
  const {
    statusCode = HTTP_STATUS.OK,
    message = 'Success',
    data = null,
    meta = null
  } = options;

  const response = {
    success: true,
    message,
    data,
    ...(meta && { meta }) // Only include meta if provided
  };

  return res.status(statusCode).json(response);
};

/**
 * Sends an error response
 * 
 * @function sendError
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.message='An error occurred'] - Error message
 * @param {Array} [options.errors=null] - Detailed validation errors
 * @param {string} [options.stack=null] - Error stack (dev only)
 * @returns {Object} Express response
 * 
 * @example
 * // Basic error response
 * sendError(res, { statusCode: 404, message: 'User not found' });
 * 
 * @example
 * // Validation error with details
 * sendError(res, {
 *   statusCode: 400,
 *   message: 'Validation failed',
 *   errors: [{ field: 'email', message: 'Invalid email format' }]
 * });
 */
const sendError = (res, options = {}) => {
  const {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = 'An error occurred',
    errors = null,
    stack = null
  } = options;

  const response = {
    success: false,
    message,
    data: null,
    ...(errors && { errors }), // Include validation errors if present
    ...(process.env.NODE_ENV === 'development' && stack && { stack }) // Stack trace in dev only
  };

  return res.status(statusCode).json(response);
};

/**
 * Sends a paginated response
 * 
 * @function sendPaginated
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} [options.message='Success'] - Success message
 * @param {Array} options.data - Array of items
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Items per page
 * @param {number} options.total - Total number of items
 * @returns {Object} Express response
 * 
 * @example
 * sendPaginated(res, {
 *   message: 'Tools retrieved',
 *   data: tools,
 *   page: 1,
 *   limit: 10,
 *   total: 150
 * });
 */
const sendPaginated = (res, options = {}) => {
  const { message = 'Success', data = [], page, limit, total } = options;

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    meta: {
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    }
  });
};

/**
 * Sends a created response (201)
 * 
 * @function sendCreated
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Created resource data
 * @returns {Object} Express response
 * 
 * @example
 * sendCreated(res, 'User registered successfully', { user });
 */
const sendCreated = (res, message, data) => {
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message,
    data
  });
};

/**
 * Sends a no content response (204)
 * 
 * @function sendNoContent
 * @param {Object} res - Express response object
 * @returns {Object} Express response
 * 
 * @example
 * sendNoContent(res); // For successful DELETE operations
 */
const sendNoContent = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent
};
