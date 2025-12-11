/**
 * @fileoverview Upload routes
 * @description API endpoints for file/image uploads using Cloudinary
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const {
  uploadAvatar,
  uploadCourseThumbnail,
  uploadToolIcon,
  uploadGeneral,
  deleteImage,
  getPublicIdFromUrl
} = require('../config/cloudinary');
const User = require('../models/User');
const Course = require('../models/Course');
const Tool = require('../models/Tool');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Delete old avatar if exists
    const user = await User.findById(req.user._id);
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(user.avatar);
      if (publicId) {
        await deleteImage(publicId).catch(err => console.log('Old avatar delete failed:', err));
      }
    }

    // Update user with new avatar URL
    user.avatar = req.file.path;
    await user.save();

    logger.info('Avatar uploaded', { userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: req.file.path,
        user
      }
    });
  } catch (error) {
    logger.error('Avatar upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload avatar'
    });
  }
});

/**
 * @swagger
 * /api/upload/course-thumbnail/{courseId}:
 *   post:
 *     summary: Upload course thumbnail
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
 */
router.post('/course-thumbnail/:courseId', protect, adminOnly, uploadCourseThumbnail.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete old thumbnail if exists
    if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(course.thumbnail);
      if (publicId) {
        await deleteImage(publicId).catch(err => console.log('Old thumbnail delete failed:', err));
      }
    }

    // Update course with new thumbnail URL
    course.thumbnail = req.file.path;
    await course.save();

    logger.info('Course thumbnail uploaded', { courseId: req.params.courseId });

    res.status(200).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        url: req.file.path,
        course
      }
    });
  } catch (error) {
    logger.error('Thumbnail upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload thumbnail'
    });
  }
});

/**
 * @swagger
 * /api/upload/tool-icon/{toolId}:
 *   post:
 *     summary: Upload tool icon
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Icon uploaded successfully
 */
router.post('/tool-icon/:toolId', protect, adminOnly, uploadToolIcon.single('icon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const tool = await Tool.findById(req.params.toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Delete old icon if exists
    if (tool.icon && tool.icon.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(tool.icon);
      if (publicId) {
        await deleteImage(publicId).catch(err => console.log('Old icon delete failed:', err));
      }
    }

    // Update tool with new icon URL
    tool.icon = req.file.path;
    await tool.save();

    logger.info('Tool icon uploaded', { toolId: req.params.toolId });

    res.status(200).json({
      success: true,
      message: 'Icon uploaded successfully',
      data: {
        url: req.file.path,
        tool
      }
    });
  } catch (error) {
    logger.error('Icon upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload icon'
    });
  }
});

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload general image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/image', protect, uploadGeneral.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    logger.info('Image uploaded', { userId: req.user._id, url: req.file.path });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    logger.error('Image upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
});

/**
 * @swagger
 * /api/upload/delete:
 *   delete:
 *     summary: Delete uploaded image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.delete('/delete', protect, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      await deleteImage(publicId);
    }

    logger.info('Image deleted', { userId: req.user._id, url });

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    logger.error('Image delete error', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
});

module.exports = router;
