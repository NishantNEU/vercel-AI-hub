/**
 * @fileoverview Authentication controller
 * @description Handles user registration, login, logout, email verification, and session management.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../middlewares/error.middleware');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

/**
 * Generates a JWT token for authenticated users
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create new user (not verified yet)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    isEmailVerified: false
  });

  // Generate OTP for email verification
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // Send verification OTP email
  try {
    await emailService.sendOTPEmail({
      to: user.email,
      name: user.name,
      otp
    });
  } catch (error) {
    // If email fails, delete the user and return error
    await User.findByIdAndDelete(user._id);
    logger.error('Failed to send verification email', { email, error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again.'
    });
  }

  // Generate JWT (user can login but with limited access until verified)
  const token = generateToken(user._id);

  logger.info('New user registered, OTP sent', { userId: user._id, email: user.email });

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email for verification code.',
    data: { 
      user,
      token,
      requiresVerification: true
    }
  });
});

/**
 * @desc    Verify email with OTP
 * @route   POST /api/auth/verify-email
 * @access  Private
 */
exports.verifyEmail = catchAsync(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the verification code'
    });
  }

  // Get user with OTP fields
  const user = await User.findById(req.user.id).select('+emailOTP +emailOTPExpires');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Verify OTP
  if (!user.verifyOTP(otp)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification code'
    });
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email (non-blocking)
  emailService.sendWelcomeEmail({
    to: user.email,
    name: user.name
  }).catch(err => logger.error('Failed to send welcome email', { error: err.message }));

  logger.info('Email verified', { userId: user._id, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully!',
    data: { user }
  });
});

/**
 * @desc    Resend verification OTP
 * @route   POST /api/auth/resend-otp
 * @access  Private
 */
exports.resendOTP = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Generate new OTP
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  try {
    await emailService.sendOTPEmail({
      to: user.email,
      name: user.name,
      otp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.'
    });
  }

  logger.info('OTP resent', { userId: user._id, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Verification code sent! Please check your email.'
  });
});

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user signed up with Google
  if (!user.password && user.googleId) {
    return res.status(401).json({
      success: false,
      message: 'This account uses Google sign-in. Please use "Continue with Google" to login.'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn('Failed login attempt', { email });
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate JWT
  const token = generateToken(user._id);

  logger.info('User logged in', { userId: user._id, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { 
      user, 
      token,
      requiresVerification: !user.isEmailVerified
    }
  });
});

/**
 * @desc    Get current logged in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User profile retrieved',
    data: { user }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name: name.trim() },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  logger.info('User profile updated', { userId: user._id });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = catchAsync(async (req, res) => {
  logger.info('User logged out', { userId: req.user._id, email: req.user.email });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null
  });
});

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
exports.googleCallback = catchAsync(async (req, res) => {
  const user = req.user;
  const token = generateToken(user._id);

  logger.info('User logged in via Google', { userId: user._id, email: user.email });

  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
});

/**
 * @desc    Refresh JWT token
 * @route   POST /api/auth/refresh-token
 * @access  Private
 */
exports.refreshToken = catchAsync(async (req, res) => {
  const token = generateToken(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token }
  });
});

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user.password) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change password for Google OAuth accounts'
    });
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters'
    });
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  logger.info('User changed password', { userId: user._id });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: { token }
  });
});

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  // Don't reveal if user exists
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  }

  // Check if user uses Google OAuth
  if (user.googleId && !user.password) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send email
  try {
    await emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetToken
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset email. Please try again.'
    });
  }

  logger.info('Password reset email sent', { email });

  res.status(200).json({
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.'
  });
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide token and new password'
    });
  }

  // Find user by reset token
  const user = await User.findByResetToken(token);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new JWT
  const jwtToken = generateToken(user._id);

  logger.info('Password reset successful', { userId: user._id });

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    data: { token: jwtToken }
  });
});

/**
 * @desc    Delete own account (User self-delete)
 * @route   DELETE /api/auth/delete-account
 * @access  Private
 */
exports.deleteAccount = catchAsync(async (req, res) => {
  const { password, confirmation } = req.body;

  // Require confirmation text
  if (confirmation !== 'DELETE') {
    return res.status(400).json({
      success: false,
      message: 'Please type DELETE to confirm account deletion'
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // If user has password (not just Google OAuth), verify it
  if (user.password) {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }
  }

  // Delete related data
  const mongoose = require('mongoose');
  
  // Delete user's chats
  await mongoose.model('Chat').deleteMany({ user: user._id });
  
  // Delete user's enrollments
  await mongoose.model('Enrollment').deleteMany({ user: user._id });

  // Delete the user
  await User.findByIdAndDelete(user._id);

  logger.info('User account deleted', { userId: user._id, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
    data: null
  });
});
