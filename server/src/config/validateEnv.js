/**
 * @fileoverview Environment variable validation
 * @description Validates all required environment variables on application startup.
 * Prevents the server from starting with missing or invalid configuration.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');

/**
 * Required environment variables configuration
 * Each entry specifies the variable name, whether it's required,
 * and an optional validation function
 * 
 * @type {Array<Object>}
 */
const envConfig = [
  {
    name: 'NODE_ENV',
    required: true,
    validator: (val) => ['development', 'production', 'test'].includes(val),
    message: 'NODE_ENV must be development, production, or test'
  },
  {
    name: 'PORT',
    required: false,
    default: '5000',
    validator: (val) => !isNaN(parseInt(val)),
    message: 'PORT must be a valid number'
  },
  {
    name: 'MONGODB_URI',
    required: true,
    validator: (val) => val.startsWith('mongodb'),
    message: 'MONGODB_URI must be a valid MongoDB connection string'
  },
  {
    name: 'JWT_SECRET',
    required: true,
    validator: (val) => val.length >= 32,
    message: 'JWT_SECRET must be at least 32 characters for security'
  },
  {
    name: 'CLIENT_URL',
    required: true,
    validator: (val) => val.startsWith('http'),
    message: 'CLIENT_URL must be a valid URL'
  },
  {
    name: 'GEMINI_API_KEY',
    required: false, // Not required for initial setup
    message: 'GEMINI_API_KEY is required for AI features'
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    required: false, // Not required for initial setup
    message: 'GOOGLE_CLIENT_ID is required for Google OAuth'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    required: false,
    message: 'GOOGLE_CLIENT_SECRET is required for Google OAuth'
  },
  {
    name: 'CLOUDINARY_CLOUD_NAME',
    required: false,
    message: 'CLOUDINARY_CLOUD_NAME is required for image uploads'
  }
];

/**
 * Validates all environment variables
 * 
 * @function validateEnv
 * @throws {Error} If required variables are missing or invalid
 * @returns {void}
 * 
 * @description
 * This function should be called at application startup before
 * any other initialization. It will:
 * 1. Check all required variables exist
 * 2. Run custom validators if defined
 * 3. Set default values if specified
 * 4. Log warnings for optional missing variables
 * 5. Throw error if required variables are missing
 * 
 * @example
 * // In app.js, before any other code:
 * require('./config/validateEnv')();
 */
const validateEnv = () => {
  const errors = [];
  const warnings = [];

  logger.info('🔍 Validating environment variables...');

  envConfig.forEach(({ name, required, default: defaultVal, validator, message }) => {
    const value = process.env[name];

    // Check if variable exists
    if (!value) {
      if (required) {
        errors.push(`❌ Missing required env variable: ${name}`);
      } else if (defaultVal) {
        // Set default value
        process.env[name] = defaultVal;
        logger.debug(`Setting default value for ${name}`);
      } else {
        warnings.push(`⚠️  Optional env variable not set: ${name} - ${message}`);
      }
      return;
    }

    // Run custom validator if provided
    if (validator && !validator(value)) {
      errors.push(`❌ Invalid value for ${name}: ${message}`);
    }
  });

  // Log warnings
  warnings.forEach(warning => logger.warn(warning));

  // Throw if there are errors
  if (errors.length > 0) {
    errors.forEach(error => logger.error(error));
    throw new Error(
      `Environment validation failed with ${errors.length} error(s). ` +
      'Please check your .env file.'
    );
  }

  logger.info('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
