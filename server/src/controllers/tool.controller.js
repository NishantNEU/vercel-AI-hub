/**
 * @fileoverview Tool controller
 * @description Handles CRUD operations for AI tools directory
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const Tool = require('../models/Tool');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../middlewares/error.middleware');
const logger = require('../utils/logger');

/**
 * @desc    Get all tools with filtering, sorting, pagination
 * @route   GET /api/tools
 * @access  Public
 */
exports.getTools = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    pricing, 
    featured,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (category) filter.category = category;
  if (pricing) filter.pricing = pricing;
  if (featured === 'true') filter.featured = true;
  
  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const tools = await Tool.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('createdBy', 'name');

  // Get total count
  const total = await Tool.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: 'Tools retrieved successfully',
    data: { tools },
    meta: {
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * @desc    Get single tool by ID
 * @route   GET /api/tools/:id
 * @access  Public
 */
exports.getTool = catchAsync(async (req, res) => {
  const tool = await Tool.findById(req.params.id)
    .populate('createdBy', 'name');

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'Tool not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Tool retrieved successfully',
    data: { tool }
  });
});

/**
 * @desc    Create new tool
 * @route   POST /api/tools
 * @access  Private (Admin only)
 */
exports.createTool = catchAsync(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Add creator
  req.body.createdBy = req.user._id;

  // Create tool
  const tool = await Tool.create(req.body);

  logger.info('New tool created', { toolId: tool._id, name: tool.name });

  res.status(201).json({
    success: true,
    message: 'Tool created successfully',
    data: { tool }
  });
});

/**
 * @desc    Update tool
 * @route   PUT /api/tools/:id
 * @access  Private (Admin only)
 */
exports.updateTool = catchAsync(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  let tool = await Tool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'Tool not found'
    });
  }

  // Update tool
  tool = await Tool.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  logger.info('Tool updated', { toolId: tool._id, name: tool.name });

  res.status(200).json({
    success: true,
    message: 'Tool updated successfully',
    data: { tool }
  });
});

/**
 * @desc    Delete tool
 * @route   DELETE /api/tools/:id
 * @access  Private (Admin only)
 */
exports.deleteTool = catchAsync(async (req, res) => {
  const tool = await Tool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'Tool not found'
    });
  }

  await Tool.findByIdAndDelete(req.params.id);

  logger.info('Tool deleted', { toolId: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Tool deleted successfully',
    data: null
  });
});

/**
 * @desc    Bookmark a tool
 * @route   POST /api/tools/:id/bookmark
 * @access  Private
 */
exports.bookmarkTool = catchAsync(async (req, res) => {
  const tool = await Tool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'Tool not found'
    });
  }

  const user = await User.findById(req.user._id);

  // Check if already bookmarked
  const isBookmarked = user.bookmarkedTools.includes(req.params.id);

  if (isBookmarked) {
    // Remove bookmark
    user.bookmarkedTools = user.bookmarkedTools.filter(
      toolId => toolId.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed',
      data: { bookmarked: false }
    });
  } else {
    // Add bookmark
    user.bookmarkedTools.push(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Tool bookmarked',
      data: { bookmarked: true }
    });
  }
});

/**
 * @desc    Get user's bookmarked tools
 * @route   GET /api/tools/bookmarks
 * @access  Private
 */
exports.getBookmarkedTools = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'bookmarkedTools',
      match: { isActive: true }
    });

  res.status(200).json({
    success: true,
    message: 'Bookmarked tools retrieved',
    data: { tools: user.bookmarkedTools }
  });
});

/**
 * @desc    Get featured tools
 * @route   GET /api/tools/featured
 * @access  Public
 */
exports.getFeaturedTools = catchAsync(async (req, res) => {
  const tools = await Tool.find({ featured: true, isActive: true })
    .limit(10)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Featured tools retrieved',
    data: { tools }
  });
});

/**
 * @desc    Get tools by category
 * @route   GET /api/tools/category/:category
 * @access  Public
 */
exports.getToolsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tools = await Tool.find({ category, isActive: true })
    .skip(skip)
    .limit(parseInt(limit))
    .sort('-createdAt');

  const total = await Tool.countDocuments({ category, isActive: true });

  res.status(200).json({
    success: true,
    message: `Tools in ${category} category`,
    data: { tools },
    meta: {
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});
