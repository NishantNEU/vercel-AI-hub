/**
 * @fileoverview Winston logger configuration
 * @description Provides structured logging with different transports for
 * development and production environments. Logs are formatted for easy
 * reading in development and JSON format in production.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const winston = require('winston');

/**
 * Custom log format for development
 * Includes timestamp, level, and colorized output
 */
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Include additional metadata if present
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

/**
 * Custom log format for production
 * JSON format for easy parsing by log aggregators
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Winston logger instance
 * @type {winston.Logger}
 * 
 * @description
 * Log levels (from highest to lowest priority):
 * - error: Error events that might still allow the app to continue
 * - warn: Warning events, potentially harmful situations
 * - info: Informational messages highlighting progress
 * - http: HTTP request logging
 * - debug: Detailed debugging information
 * 
 * @example
 * const logger = require('./utils/logger');
 * 
 * logger.info('Server started', { port: 5000 });
 * logger.error('Database connection failed', { error: err.message });
 * logger.debug('User data', { userId: '123', action: 'login' });
 */
const logger = winston.createLogger({
  // Set log level based on environment
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  // Use appropriate format based on environment
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  
  // Default metadata attached to all logs
  defaultMeta: { 
    service: 'ai-super-hub-api' 
  },
  
  // Define transports (where logs are sent)
  transports: [
    // Console transport - always active
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true
    })
  ],
  
  // Don't exit on handled exceptions
  exitOnError: false
});

/**
 * Stream for Morgan HTTP logger integration
 * Allows Morgan to write through Winston
 * 
 * @example
 * app.use(morgan('combined', { stream: logger.stream }));
 */
logger.stream = {
  write: (message) => {
    // Remove newline character from Morgan's message
    logger.http(message.trim());
  }
};

module.exports = logger;
