/**
 * @fileoverview Authentication request validators
 * @description Defines validation rules for authentication endpoints
 * using express-validator. Ensures data integrity before processing.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { body } = require('express-validator');

/**
 * Validation rules for user registration
 * 
 * @type {Array<ValidationChain>}
 * 
 * @description
 * Validates:
 * - name: Required, 2-50 characters, trimmed
 * - email: Required, valid email format, normalized
 * - password: Required, min 8 chars, must contain uppercase, lowercase, and number
 * 
 * @example
 * router.post('/register', registerValidator, authController.register);
 */
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .custom((value) => {
      // Check for common weak passwords
      const weakPasswords = [
        'password', 'password1', 'password123', '12345678', 
        'qwerty123', 'letmein', 'welcome1', 'admin123'
      ];
      if (weakPasswords.includes(value.toLowerCase())) {
        throw new Error('This password is too common. Please choose a stronger password.');
      }
      return true;
    })
];

/**
 * Validation rules for user login
 * 
 * @type {Array<ValidationChain>}
 * 
 * @description
 * Validates:
 * - email: Required, valid email format
 * - password: Required (no format validation - checked against DB)
 * 
 * @example
 * router.post('/login', loginValidator, authController.login);
 */
const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for password change
 * 
 * @type {Array<ValidationChain>}
 * 
 * @description
 * Validates:
 * - currentPassword: Required
 * - newPassword: Required, min 8 chars, must contain uppercase, lowercase, number
 * 
 * @example
 * router.put('/change-password', protect, changePasswordValidator, authController.changePassword);
 */
const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

/**
 * Validation rules for forgot password (email only)
 * 
 * @type {Array<ValidationChain>}
 * 
 * @example
 * router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
 */
const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

/**
 * Validation rules for profile update
 * 
 * @type {Array<ValidationChain>}
 * 
 * @description
 * All fields are optional but validated if provided
 * 
 * @example
 * router.put('/profile', protect, updateProfileValidator, userController.updateProfile);
 */
const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  updateProfileValidator
};
