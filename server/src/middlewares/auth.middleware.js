/**
 * @fileoverview Authentication and authorization middleware
 * @description Provides middleware functions for protecting routes,
 * verifying JWT tokens, and implementing role-based access control.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Protects routes by verifying JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    }

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    // Attach user to request object
    req.user = user;
    
    logger.debug('User authenticated', { userId: user._id, email: user.email });

    next();
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Restricts access to specific user roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles
      });
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};

/**
 * Restricts access to admin users only
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    logger.warn('Admin access denied', { userId: req.user._id, role: req.user.role });
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

/**
 * Optional authentication - attaches user if token exists
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Token invalid - continue without user
      logger.debug('Optional auth - invalid token, continuing as anonymous');
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  restrictTo,
  adminOnly,
  optionalAuth
};
