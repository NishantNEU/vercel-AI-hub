// server/src/routes/prompt.routes.js
/**
 * @fileoverview Prompt routes
 * @description API endpoints for AI prompt library management
 */

const express = require('express');
const router = express.Router();
const promptController = require('../controllers/prompt.controller');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: Get all active prompts
 *     tags: [Prompts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *         description: Filter by difficulty level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, template
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Prompts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     prompts:
 *                       type: array
 */
router.get('/', promptController.getPrompts);

/**
 * @swagger
 * /api/prompts/featured:
 *   get:
 *     summary: Get featured prompts for homepage
 *     tags: [Prompts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Featured prompts retrieved
 */
router.get('/featured', promptController.getFeaturedPrompts);

/**
 * @swagger
 * /api/prompts/stats:
 *   get:
 *     summary: Get prompt library statistics
 *     tags: [Prompts]
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     categoryCount:
 *                       type: integer
 *                     totalCopies:
 *                       type: integer
 */
router.get('/stats', promptController.getStats);

/**
 * @swagger
 * /api/prompts/user/favorites:
 *   get:
 *     summary: Get user's favorited prompts
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorited prompts retrieved
 */
router.get('/user/favorites', protect, promptController.getUserFavorites);

/**
 * @swagger
 * /api/prompts/{id}:
 *   get:
 *     summary: Get single prompt by ID
 *     tags: [Prompts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt retrieved
 *       404:
 *         description: Prompt not found
 */
router.get('/:id', promptController.getPrompt);

/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: Create a new prompt (Admin only)
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - template
 *               - example
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               template:
 *                 type: string
 *               example:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Learning, Coding, Writing, Creative, Data & ML, Business, Research, Productivity, Career]
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Prompt created successfully
 */
router.post('/', protect, adminOnly, promptController.createPrompt);

/**
 * @swagger
 * /api/prompts/{id}:
 *   put:
 *     summary: Update a prompt (Admin only)
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt updated
 */
router.put('/:id', protect, adminOnly, promptController.updatePrompt);

/**
 * @swagger
 * /api/prompts/{id}:
 *   delete:
 *     summary: Delete a prompt (Admin only)
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prompt deleted
 */
router.delete('/:id', protect, adminOnly, promptController.deletePrompt);

/**
 * @swagger
 * /api/prompts/{id}/favorite:
 *   post:
 *     summary: Toggle favorite status for a prompt
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite status toggled
 */
router.post('/:id/favorite', protect, promptController.toggleFavorite);

/**
 * @swagger
 * /api/prompts/{id}/copy:
 *   post:
 *     summary: Track prompt copy action
 *     tags: [Prompts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Copy tracked
 */
router.post('/:id/copy', promptController.trackCopy);

/**
 * @swagger
 * /api/prompts/improve:
 *   post:
 *     summary: Improve a user's prompt using AI (Login required)
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The rough prompt to improve
 *                 example: "write code for sorting"
 *     responses:
 *       200:
 *         description: Improved prompt generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     improved:
 *                       type: string
 */
router.post('/improve', protect, promptController.improvePrompt);

module.exports = router;

