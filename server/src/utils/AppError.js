/**
 * @fileoverview Custom error classes for standardized error handling
 * @description Provides a hierarchy of error classes that extend the native Error,
 * enabling consistent error responses across the application.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { HTTP_STATUS } = require('./constants');

/**
 * Base application error class
 * @class AppError
 * @extends Error
 * 
 * @description Custom error class that includes HTTP status code and
 * operational flag to distinguish between operational errors (expected)
 * and programming errors (bugs).
 * 
 * @example
 * throw new AppError('User not found', 404);
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    // Call parent constructor with message
    super(message);
    
    /**
     * HTTP status code for the response
     * @type {number}
     */
    this.statusCode = statusCode;
    
    /**
     * Status string derived from status code
     * @type {string}
     */
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    /**
     * Flag indicating this is an operational (expected) error
     * @type {boolean}
     */
    this.isOperational = true;
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for validation failures
 * @class ValidationError
 * @extends AppError
 * 
 * @example
 * throw new ValidationError('Email is required');
 */
class ValidationError extends AppError {
  /**
   * Creates a ValidationError instance
   * @param {string} message - Validation error message
   * @param {Array} [errors=[]] - Array of specific field errors
   */
  constructor(message, errors = []) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Error for authentication failures
 * @class AuthenticationError
 * @extends AppError
 * 
 * @example
 * throw new AuthenticationError('Invalid token');
 */
class AuthenticationError extends AppError {
  /**
   * Creates an AuthenticationError instance
   * @param {string} [message='Authentication required'] - Error message
   */
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error for authorization failures (user authenticated but not permitted)
 * @class AuthorizationError
 * @extends AppError
 * 
 * @example
 * throw new AuthorizationError('Admin access required');
 */
class AuthorizationError extends AppError {
  /**
   * Creates an AuthorizationError instance
   * @param {string} [message='Permission denied'] - Error message
   */
  constructor(message = 'You do not have permission to perform this action') {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error for resource not found
 * @class NotFoundError
 * @extends AppError
 * 
 * @example
 * throw new NotFoundError('User');
 */
class NotFoundError extends AppError {
  /**
   * Creates a NotFoundError instance
   * @param {string} [resource='Resource'] - Name of the resource not found
   */
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

/**
 * Error for duplicate/conflict resources
 * @class ConflictError
 * @extends AppError
 * 
 * @example
 * throw new ConflictError('User with this email already exists');
 */
class ConflictError extends AppError {
  /**
   * Creates a ConflictError instance
   * @param {string} message - Conflict description
   */
  constructor(message) {
    super(message, HTTP_STATUS.CONFLICT);
    this.name = 'ConflictError';
  }
}

/**
 * Error for rate limiting
 * @class RateLimitError
 * @extends AppError
 * 
 * @example
 * throw new RateLimitError();
 */
class RateLimitError extends AppError {
  /**
   * Creates a RateLimitError instance
   * @param {string} [message='Too many requests'] - Error message
   */
  constructor(message = 'Too many requests, please try again later') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
