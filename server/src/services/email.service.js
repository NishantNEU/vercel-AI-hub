/**
 * @fileoverview Email service using SendGrid
 * @description Handles sending verification emails, password reset emails, etc.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Sender configuration
const SENDER_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'diveshnaik452@gmail.com';
const SENDER_NAME = process.env.SENDGRID_FROM_NAME || 'AI Super Hub';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Generate a random verification token
 * @returns {string} Random hex token
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a 6-digit OTP code
 * @returns {string} 6-digit code
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send email verification link
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.verificationToken - Verification token
 * @returns {Promise<boolean>} Success status
 */
const sendVerificationEmail = async ({ to, name, verificationToken }) => {
  const verificationUrl = `${CLIENT_URL}/verify-email?token=${verificationToken}`;
  
  const msg = {
    to,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME
    },
    subject: 'Verify Your Email - AI Super Hub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0D0D0D;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #00E3A5; font-size: 28px; margin: 0;">
              🚀 AI Super Hub
            </h1>
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #161616; border-radius: 16px; padding: 40px; border: 1px solid #262626;">
            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
              Verify Your Email
            </h2>
            
            <p style="color: #A0A0A0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Hi <strong style="color: #FFFFFF;">${name}</strong>,<br>
              Thanks for signing up! Please verify your email address to get started.
            </p>
            
            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00E3A5 0%, #00D1FF 100%); 
                        color: #0D0D0D; text-decoration: none; padding: 16px 48px; border-radius: 12px; 
                        font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666666; font-size: 14px; text-align: center; margin: 24px 0 0 0;">
              This link expires in <strong style="color: #A0A0A0;">24 hours</strong>
            </p>
            
            <!-- Divider -->
            <div style="border-top: 1px solid #262626; margin: 32px 0;"></div>
            
            <!-- Alternative Link -->
            <p style="color: #666666; font-size: 12px; margin: 0; word-break: break-all;">
              If the button doesn't work, copy and paste this link:<br>
              <a href="${verificationUrl}" style="color: #00E3A5;">${verificationUrl}</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              You received this email because you signed up for AI Super Hub.<br>
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},
      
      Thanks for signing up for AI Super Hub! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This link expires in 24 hours.
      
      If you didn't create an account, you can safely ignore this email.
      
      - AI Super Hub Team
    `
  };

  try {
    await sgMail.send(msg);
    logger.info('Verification email sent', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send verification email', { 
      to, 
      error: error.message,
      response: error.response?.body 
    });
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send OTP verification code
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.otp - 6-digit OTP code
 * @returns {Promise<boolean>} Success status
 */
const sendOTPEmail = async ({ to, name, otp }) => {
  const msg = {
    to,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME
    },
    subject: 'Your Verification Code - AI Super Hub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0D0D0D;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #00E3A5; font-size: 28px; margin: 0;">
              🚀 AI Super Hub
            </h1>
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #161616; border-radius: 16px; padding: 40px; border: 1px solid #262626;">
            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
              Verification Code
            </h2>
            
            <p style="color: #A0A0A0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Hi <strong style="color: #FFFFFF;">${name}</strong>,<br>
              Use the code below to verify your email address.
            </p>
            
            <!-- OTP Code -->
            <div style="text-align: center; margin: 32px 0;">
              <div style="display: inline-block; background-color: #0D0D0D; border: 2px solid #00E3A5; 
                          border-radius: 12px; padding: 20px 40px;">
                <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #00E3A5;">
                  ${otp}
                </span>
              </div>
            </div>
            
            <p style="color: #666666; font-size: 14px; text-align: center; margin: 24px 0 0 0;">
              This code expires in <strong style="color: #A0A0A0;">10 minutes</strong>
            </p>
            
            <!-- Warning -->
            <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-top: 24px;">
              <p style="color: #F97316; font-size: 12px; margin: 0; text-align: center;">
                âš ï¸ Never share this code with anyone. Our team will never ask for it.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              You received this email because you're verifying your AI Super Hub account.<br>
              If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},
      
      Your verification code for AI Super Hub is: ${otp}
      
      This code expires in 10 minutes.
      
      Never share this code with anyone. Our team will never ask for it.
      
      If you didn't request this code, you can safely ignore this email.
      
      - AI Super Hub Team
    `
  };

  try {
    await sgMail.send(msg);
    logger.info('OTP email sent', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send OTP email', { 
      to, 
      error: error.message 
    });
    throw new Error('Failed to send verification code');
  }
};

/**
 * Send welcome email after verification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @returns {Promise<boolean>} Success status
 */
const sendWelcomeEmail = async ({ to, name }) => {
  const msg = {
    to,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME
    },
    subject: 'Welcome to AI Super Hub! ðŸŽ‰',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0D0D0D;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #00E3A5; font-size: 28px; margin: 0;">
              🚀 AI Super Hub
            </h1>
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #161616; border-radius: 16px; padding: 40px; border: 1px solid #262626;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 48px;">ðŸŽ‰</span>
            </div>
            
            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
              Welcome to AI Super Hub!
            </h2>
            
            <p style="color: #A0A0A0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Hi <strong style="color: #FFFFFF;">${name}</strong>,<br>
              Your email has been verified. You're all set to explore the world of AI!
            </p>
            
            <!-- Features -->
            <div style="margin: 32px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="color: #00E3A5; margin-right: 12px;">âœ“</span>
                <span style="color: #FFFFFF;">Access 50+ curated AI tools</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="color: #00E3A5; margin-right: 12px;">âœ“</span>
                <span style="color: #FFFFFF;">Learn from expert-led courses</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="color: #00E3A5; margin-right: 12px;">âœ“</span>
                <span style="color: #FFFFFF;">Chat with advanced AI models</span>
              </div>
            </div>
            
            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${CLIENT_URL}/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #00E3A5 0%, #00D1FF 100%); 
                        color: #0D0D0D; text-decoration: none; padding: 16px 48px; border-radius: 12px; 
                        font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              Need help? Reply to this email or visit our support center.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to AI Super Hub, ${name}! ðŸŽ‰
      
      Your email has been verified. You're all set to explore the world of AI!
      
      Here's what you can do:
      âœ“ Access 50+ curated AI tools
      âœ“ Learn from expert-led courses  
      âœ“ Chat with advanced AI models
      
      Get started: ${CLIENT_URL}/dashboard
      
      - AI Super Hub Team
    `
  };

  try {
    await sgMail.send(msg);
    logger.info('Welcome email sent', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send welcome email', { to, error: error.message });
    // Don't throw - welcome email is not critical
    return false;
  }
};

/**
 * Send password reset email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.resetToken - Password reset token
 * @returns {Promise<boolean>} Success status
 */
const sendPasswordResetEmail = async ({ to, name, resetToken }) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const msg = {
    to,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME
    },
    subject: 'Reset Your Password - AI Super Hub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0D0D0D;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #00E3A5; font-size: 28px; margin: 0;">
              🚀 AI Super Hub
            </h1>
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #161616; border-radius: 16px; padding: 40px; border: 1px solid #262626;">
            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
              Reset Your Password
            </h2>
            
            <p style="color: #A0A0A0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Hi <strong style="color: #FFFFFF;">${name}</strong>,<br>
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00E3A5 0%, #00D1FF 100%); 
                        color: #0D0D0D; text-decoration: none; padding: 16px 48px; border-radius: 12px; 
                        font-weight: 600; font-size: 16px;"
                 target="_blank">
                Reset Password
              </a>
            </div>
            
            <!-- Plain text link fallback -->
            <p style="color: #666666; font-size: 12px; text-align: center; margin: 16px 0;">
              Button not working? Copy and paste this link in your browser:<br>
              <a href="${resetUrl}" style="color: #00E3A5; word-break: break-all;" target="_blank">${resetUrl}</a>
            </p>
            
            <p style="color: #666666; font-size: 14px; text-align: center; margin: 24px 0 0 0;">
              This link expires in <strong style="color: #A0A0A0;">1 hour</strong>
            </p>
            
            <!-- Warning -->
            <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-top: 24px;">
              <p style="color: #F97316; font-size: 12px; margin: 0; text-align: center;">
                âš ï¸ If you didn't request this, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              For security, this request was received from your account.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},
      
      We received a request to reset your password for AI Super Hub.
      
      Click here to reset: ${resetUrl}
      
      This link expires in 1 hour.
      
      If you didn't request this, please ignore this email. Your password will remain unchanged.
      
      - AI Super Hub Team
    `
  };

  try {
    await sgMail.send(msg);
    logger.info('Password reset email sent', { to });
    return true;
  } catch (error) {
    logger.error('Failed to send password reset email', { to, error: error.message });
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  generateToken,
  generateOTP,
  sendVerificationEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};

const sendSupportResolvedEmail = async ({ to, name, subject, adminNotes }) => {
  const msg = {
    to,
    from: { email: SENDER_EMAIL, name: SENDER_NAME },
    subject: `Support Resolved: ${subject}`,
    html: `<div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; background: #0D0D0D; color: #E5E5E5;"><h1 style="color: #00E3A5;">✅ Support Resolved</h1><p>Hi ${name},</p><p>Your support request has been resolved.</p><div style="background: #161616; padding: 15px; margin: 20px 0; border-left: 4px solid #00E3A5;"><strong>Subject:</strong> ${subject}</div>${adminNotes ? `<div style="background: #161616; padding: 15px; margin: 20px 0;"><strong>Notes:</strong><br/>${adminNotes}</div>` : ''}<a href="${CLIENT_URL}/support" style="display: inline-block; background: linear-gradient(135deg, #00E3A5, #4FC3F7); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Visit Support</a></div>`
  };
  try {
    await sgMail.send(msg);
    logger.info('Support resolved email sent', { to });
    return true;
  } catch (error) {
    logger.error('Email send failed', { to, error: error.message });
    return false;
  }
};

module.exports.sendSupportResolvedEmail = sendSupportResolvedEmail;
