/**
 * @fileoverview Main Express application entry point
 * @description Configures and initializes the Express server with all middleware,
 * routes, and error handling.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

// Internal imports
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const logger = require('./utils/logger');
const { errorHandler } = require('./middlewares/error.middleware');

// Passport for Google OAuth
const passport = require('./config/passport');

// Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

/**
 * Validate environment variables before starting
 */
validateEnv();

/**
 * Initialize Express application
 */
const app = express();

/**
 * Connect to MongoDB database
 */
connectDB();

/* ============================================
   SECURITY MIDDLEWARE
   ============================================ */

// Helmet - Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window (increased for development)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Data Sanitization - Prevent NoSQL injection
app.use(mongoSanitize());

// HPP - Prevent HTTP Parameter Pollution
app.use(hpp());

/* ============================================
   UTILITY MIDDLEWARE
   ============================================ */

// Compression - Compress response bodies
app.use(compression());

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ============================================
   PASSPORT INITIALIZATION (Google OAuth)
   ============================================ */

app.use(passport.initialize());

/* ============================================
   API DOCUMENTATION
   ============================================ */

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AI Super Hub API Documentation'
}));

/* ============================================
   HEALTH CHECK ENDPOINT
   ============================================ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Super Hub API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

/* ============================================
   API ROUTES
   ============================================ */

// Authentication routes (includes Google OAuth)
app.use('/api/auth', require('./routes/auth.routes'));

// Tool routes
app.use('/api/tools', require('./routes/tool.routes'));

// Chat routes
app.use('/api/chats', require('./routes/chat.routes'));

// Course routes
app.use('/api/courses', require('./routes/course.routes'));

// User routes
app.use('/api/users', require('./routes/user.routes'));

// Upload routes (Cloudinary)
app.use('/api/upload', require('./routes/upload.routes'));

// Prompt routes
app.use('/api/prompts', require('./routes/prompt.routes'));

// Support routes
app.use('/api/support', require('./routes/support.routes'));


/* ============================================
   ERROR HANDLING
   ============================================ */

// 404 Handler - Catch undefined routes
app.all('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

/* ============================================
   SERVER STARTUP
   ============================================ */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`
  â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
  â•‘         AI Super Hub Server is Running!                â•‘
  â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
  â•‘  Environment:  ${process.env.NODE_ENV || 'development'}                            â•‘
  â•‘  Local:        http://localhost:${PORT}                   â•‘
  â•‘  API:          http://localhost:${PORT}/api               â•‘
  â•‘  Docs:         http://localhost:${PORT}/api/docs          â•‘
  â•‘  Google OAuth: Enabled                                 â•‘
  â•‘  Cloudinary:   Enabled                                 â•‘
  â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! ðŸ’¥ Shutting down...', { error: err.message });
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('ðŸ‘‹ SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('ðŸ’¥ Process terminated!');
  });
});

module.exports = app;
