/**
 * @fileoverview Global error handling middleware
 * @description Centralized error handling for all routes.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');

/**
 * HTTP Status Codes (defined locally to avoid import issues)
 */
const STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Handles Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const error = new Error(message);
  error.statusCode = STATUS.BAD_REQUEST;
  error.isOperational = true;
  return error;
};

/**
 * Handles Mongoose duplicate key error
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value.`;
  const error = new Error(message);
  error.statusCode = STATUS.CONFLICT;
  error.isOperational = true;
  return error;
};

/**
 * Handles Mongoose validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message
  }));
  const error = new Error('Validation failed');
  error.statusCode = STATUS.BAD_REQUEST;
  error.isOperational = true;
  error.errors = errors;
  return error;
};

/**
 * Handles JWT invalid token error
 */
const handleJWTError = () => {
  const error = new Error('Invalid token. Please log in again.');
  error.statusCode = STATUS.UNAUTHORIZED;
  error.isOperational = true;
  return error;
};

/**
 * Handles JWT expired token error
 */
const handleJWTExpiredError = () => {
  const error = new Error('Your session has expired. Please log in again.');
  error.statusCode = STATUS.UNAUTHORIZED;
  error.isOperational = true;
  return error;
};

/**
 * Sends error response in development (detailed)
 */
const sendErrorDev = (err, res) => {
  logger.error('ERROR 💥', {
    status: err.status,
    message: err.message,
    stack: err.stack
  });

  res.status(err.statusCode || STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack
  });
};

/**
 * Sends error response in production (sanitized)
 */
const sendErrorProd = (err, res) => {
  // Operational error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  } 
  // Programming error: don't leak details
  else {
    logger.error('UNEXPECTED ERROR 💥', {
      message: err.message,
      stack: err.stack
    });

    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Set defaults
  err.statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    // Handle specific error types
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else {
    // Development: send detailed error
    sendErrorDev(err, res);
  }
};

/**
 * Async error wrapper - catches errors in async functions
 * 
 * @example
 * exports.getUser = catchAsync(async (req, res, next) => {
 *   const user = await User.findById(req.params.id);
 *   res.json({ user });
 * });
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  errorHandler,
  catchAsync
};
