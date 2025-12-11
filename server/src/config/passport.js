/**
 * @fileoverview Passport.js configuration for Google OAuth 2.0
 * @description Configures Google OAuth strategy for authentication
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Configure Google OAuth 2.0 Strategy
 * 
 * This strategy handles:
 * 1. New user registration via Google
 * 2. Existing user login via Google
 * 3. Linking Google account to existing email account
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract profile information
      const email = profile.emails[0]?.value?.toLowerCase();
      const name = profile.displayName;
      const googleId = profile.id;
      const avatar = profile.photos[0]?.value || '';

      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Check if user exists with this Google ID
      let user = await User.findOne({ googleId });

      if (user) {
        // Existing Google user - update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        
        logger.info('Existing Google user logged in', { userId: user._id, email });
        return done(null, user);
      }

      // Check if user exists with this email (registered via email/password)
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.isEmailVerified = true;
        user.lastLogin = new Date();
        
        // Update avatar if not set
        if (!user.avatar && avatar) {
          user.avatar = avatar;
        }
        
        await user.save({ validateBeforeSave: false });
        
        logger.info('Google account linked to existing user', { userId: user._id, email });
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        isEmailVerified: true,
        // No password for Google OAuth users
      });

      logger.info('New user registered via Google', { userId: user._id, email });
      return done(null, user);

    } catch (error) {
      logger.error('Google OAuth error', { error: error.message });
      return done(error, null);
    }
  }
));

/**
 * Serialize user for session
 * Stores only user ID in session
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserialize user from session
 * Retrieves full user object from database
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
