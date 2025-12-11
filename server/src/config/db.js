/**
 * @fileoverview MongoDB database connection configuration
 * @description Establishes and manages the connection to MongoDB Atlas.
 * Handles connection events, errors, and graceful disconnection.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB database
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 * 
 * @description
 * Establishes connection to MongoDB using the URI from environment variables.
 * Implements connection event handlers for monitoring connection status.
 * 
 * @example
 * // In app.js
 * const connectDB = require('./config/db');
 * connectDB();
 */
const connectDB = async () => {
  try {
    // Connection options for MongoDB driver
    const options = {
      // These options are now default in Mongoose 6+
      // but included for clarity
    };

    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Gracefully closes the MongoDB connection
 * 
 * @async
 * @function closeDB
 * @returns {Promise<void>}
 * 
 * @description
 * Used for graceful shutdown during testing or server termination.
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', { error: error.message });
  }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
