// server/src/controllers/prompt.controller.js
/**
 * @fileoverview Prompt Controller
 * @description Handles prompt library operations including AI enhancement
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const Prompt = require('../models/Prompt');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../middlewares/error.middleware');
const { generateResponse } = require('../services/gemini.service');
const logger = require('../utils/logger');

/**
 * @desc    Get all prompts with filtering
 * @route   GET /api/prompts
 * @access  Public
 */
exports.getPrompts = catchAsync(async (req, res) => {
  const { 
    category, 
    difficulty, 
    search, 
    tags,
    featured,
    sort = '-usageCount',
    page = 1, 
    limit = 20 
  } = req.query;

  // Build filter
  const filter = { isActive: true };
  
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  
  if (featured === 'true') {
    filter.isFeatured = true;
  }
  
  if (tags) {
    filter.tags = { $in: tags.split(',') };
  }

  // Build query
  let query;
  
  if (search) {
    query = Prompt.find({
      ...filter,
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { template: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    });
  } else {
    query = Prompt.find(filter);
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const prompts = await query
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-favoritedBy');

  const total = await Prompt.countDocuments(filter);

  // Get categories with counts
  const categories = await Prompt.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    message: 'Prompts retrieved successfully',
    data: { 
      prompts,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    },
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
 * @desc    Get single prompt
 * @route   GET /api/prompts/:id
 * @access  Public
 */
exports.getPrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);

  if (!prompt || !prompt.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Prompt not found'
    });
  }

  // Increment usage count
  prompt.usageCount += 1;
  await prompt.save();

  res.status(200).json({
    success: true,
    message: 'Prompt retrieved successfully',
    data: { prompt }
  });
});

/**
 * @desc    Get featured prompts for homepage
 * @route   GET /api/prompts/featured
 * @access  Public
 */
exports.getFeaturedPrompts = catchAsync(async (req, res) => {
  const { limit = 6 } = req.query;

  const prompts = await Prompt.find({ 
    isFeatured: true, 
    isActive: true 
  })
    .sort('-usageCount')
    .limit(parseInt(limit))
    .select('title description category color icon usageCount');

  res.status(200).json({
    success: true,
    message: 'Featured prompts retrieved successfully',
    data: { prompts }
  });
});

/**
 * @desc    Get prompt statistics
 * @route   GET /api/prompts/stats
 * @access  Public
 */
exports.getStats = catchAsync(async (req, res) => {
  const stats = await Prompt.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalPrompts: { $sum: 1 },
        totalUsage: { $sum: '$usageCount' },
        totalCopies: { $sum: '$copyCount' },
        totalFavorites: { $sum: '$favoriteCount' },
        categories: { $addToSet: '$category' }
      }
    }
  ]);

  const categoryStats = await Prompt.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: stats[0]?.totalPrompts || 0,
      totalUsage: stats[0]?.totalUsage || 0,
      totalCopies: stats[0]?.totalCopies || 0,
      totalFavorites: stats[0]?.totalFavorites || 0,
      categoryCount: stats[0]?.categories?.length || 0,
      categories: categoryStats
    }
  });
});

/**
 * @desc    Create new prompt (Admin only)
 * @route   POST /api/prompts
 * @access  Private/Admin
 */
exports.createPrompt = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const promptData = {
    ...req.body,
    createdBy: req.user._id
  };

  const prompt = await Prompt.create(promptData);

  logger.info('New prompt created', { promptId: prompt._id, title: prompt.title });

  res.status(201).json({
    success: true,
    message: 'Prompt created successfully',
    data: { prompt }
  });
});

/**
 * @desc    Update prompt (Admin only)
 * @route   PUT /api/prompts/:id
 * @access  Private/Admin
 */
exports.updatePrompt = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const prompt = await Prompt.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!prompt) {
    return res.status(404).json({
      success: false,
      message: 'Prompt not found'
    });
  }

  logger.info('Prompt updated', { promptId: prompt._id });

  res.status(200).json({
    success: true,
    message: 'Prompt updated successfully',
    data: { prompt }
  });
});

/**
 * @desc    Delete prompt (Admin only)
 * @route   DELETE /api/prompts/:id
 * @access  Private/Admin
 */
exports.deletePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findByIdAndDelete(req.params.id);

  if (!prompt) {
    return res.status(404).json({
      success: false,
      message: 'Prompt not found'
    });
  }

  logger.info('Prompt deleted', { promptId: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Prompt deleted successfully',
    data: null
  });
});

/**
 * @desc    Toggle favorite prompt
 * @route   POST /api/prompts/:id/favorite
 * @access  Private
 */
exports.toggleFavorite = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);

  if (!prompt) {
    return res.status(404).json({
      success: false,
      message: 'Prompt not found'
    });
  }

  const userId = req.user._id;
  const isFavorited = prompt.favoritedBy.includes(userId);

  if (isFavorited) {
    prompt.favoritedBy.pull(userId);
    prompt.favoriteCount = Math.max(0, prompt.favoriteCount - 1);
  } else {
    prompt.favoritedBy.push(userId);
    prompt.favoriteCount += 1;
  }

  await prompt.save();

  res.status(200).json({
    success: true,
    message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
    data: { 
      isFavorited: !isFavorited,
      favoriteCount: prompt.favoriteCount
    }
  });
});

/**
 * @desc    Get user's favorite prompts
 * @route   GET /api/prompts/favorites
 * @access  Private
 */
exports.getUserFavorites = catchAsync(async (req, res) => {
  const prompts = await Prompt.find({
    favoritedBy: req.user._id,
    isActive: true
  }).sort('-updatedAt');

  res.status(200).json({
    success: true,
    message: 'Favorite prompts retrieved',
    data: { prompts }
  });
});

/**
 * @desc    Increment copy count
 * @route   POST /api/prompts/:id/copy
 * @access  Public
 */
exports.trackCopy = catchAsync(async (req, res) => {
  const prompt = await Prompt.findByIdAndUpdate(
    req.params.id,
    { $inc: { copyCount: 1 } },
    { new: true }
  );

  if (!prompt) {
    return res.status(404).json({
      success: false,
      message: 'Prompt not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Copy count updated',
    data: { copyCount: prompt.copyCount }
  });
});

/**
 * @desc    AI Improve Prompt - Enhance user's rough prompt
 * @route   POST /api/prompts/improve
 * @access  Public
 */
exports.improvePrompt = catchAsync(async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }

  const systemPrompt = `You are an expert prompt engineer. Your task is to improve and enhance the given prompt to make it more effective, clear, and likely to produce better AI responses.

**Guidelines:**
1. Make the prompt more specific and detailed
2. Add clear structure (steps, format requirements)
3. Include context where helpful
4. Add constraints or parameters if beneficial
5. Keep the original intent intact

**Input Prompt:**
${prompt}

${context ? `**Context:** ${context}` : ''}

**Provide your response in this format:**

**Improved Prompt:**
[Your enhanced version of the prompt]

**Why It's Better:**
• [Reason 1]
• [Reason 2]
• [Reason 3]

**Pro Tips:**
• [Tip for using this prompt effectively]`;

  try {
    const messages = [{ role: 'user', content: systemPrompt }];
    const aiResponse = await generateResponse(messages, 'gemini-2.5-flash', 'general');

    logger.debug('Prompt improved via AI');

    res.status(200).json({
      success: true,
      message: 'Prompt improved successfully',
      data: { 
        original: prompt,
        improved: aiResponse 
      }
    });
  } catch (error) {
    logger.error('AI prompt improvement failed', { error: error.message });
    
    res.status(200).json({
      success: true,
      message: 'Could not improve prompt automatically',
      data: { 
        original: prompt,
        improved: `Here's an improved version:\n\n"${prompt}"\n\n**Suggestions:**\n• Be more specific about the desired output format\n• Add context about your use case\n• Include examples if helpful\n• Specify any constraints or requirements`
      }
    });
  }
});

/**
 * @desc    Generate prompt variations
 * @route   POST /api/prompts/variations
 * @access  Public
 */
exports.generateVariations = catchAsync(async (req, res) => {
  const { prompt, count = 3 } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }

  const systemPrompt = `Generate ${count} different variations of this prompt. Each variation should:
1. Maintain the same core intent
2. Use different wording or approach
3. Be equally effective

**Original Prompt:**
${prompt}

**Provide ${count} variations:**

**Variation 1:**
[First alternative version]

**Variation 2:**
[Second alternative version]

**Variation 3:**
[Third alternative version]

For each, briefly explain what makes it unique.`;

  try {
    const messages = [{ role: 'user', content: systemPrompt }];
    const aiResponse = await generateResponse(messages, 'gemini-2.5-flash', 'general');

    res.status(200).json({
      success: true,
      message: 'Variations generated successfully',
      data: { 
        original: prompt,
        variations: aiResponse 
      }
    });
  } catch (error) {
    logger.error('AI variation generation failed', { error: error.message });
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate variations'
    });
  }
});

/**
 * @desc    Bulk create prompts (Admin only) - for seeding
 * @route   POST /api/prompts/bulk
 * @access  Private/Admin
 */
exports.bulkCreatePrompts = catchAsync(async (req, res) => {
  const { prompts } = req.body;

  if (!prompts || !Array.isArray(prompts)) {
    return res.status(400).json({
      success: false,
      message: 'Prompts array is required'
    });
  }

  const createdPrompts = await Prompt.insertMany(
    prompts.map(p => ({ ...p, createdBy: req.user._id }))
  );

  logger.info('Bulk prompts created', { count: createdPrompts.length });

  res.status(201).json({
    success: true,
    message: `${createdPrompts.length} prompts created successfully`,
    data: { count: createdPrompts.length }
  });
});
