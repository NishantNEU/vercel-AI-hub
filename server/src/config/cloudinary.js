/**
 * @fileoverview Cloudinary configuration
 * @description Configures Cloudinary for image/file uploads
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Storage configuration for user avatars
 */
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-super-hub/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' }
    ]
  }
});

/**
 * Storage configuration for course thumbnails
 */
const courseThumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-super-hub/courses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 450, crop: 'fill' }
    ]
  }
});

/**
 * Storage configuration for tool icons
 */
const toolIconStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-super-hub/tools',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill' }
    ]
  }
});

/**
 * Storage configuration for general uploads
 */
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-super-hub/uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
    resource_type: 'auto'
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload configurations
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadCourseThumbnail = multer({
  storage: courseThumbnailStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadToolIcon = multer({
  storage: toolIconStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadGeneral = multer({
  storage: generalStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string} The public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${filename.split('.')[0]}`;
  return publicId;
};

module.exports = {
  cloudinary,
  uploadAvatar,
  uploadCourseThumbnail,
  uploadToolIcon,
  uploadGeneral,
  deleteImage,
  getPublicIdFromUrl
};
