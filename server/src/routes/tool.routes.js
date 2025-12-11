/**
 * @fileoverview Tool routes
 * @description API endpoints for AI tools directory
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const toolController = require('../controllers/tool.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const {
  createToolValidator,
  updateToolValidator,
  toolIdValidator,
  listToolsValidator
} = require('../validators/tool.validator');

/**
 * @swagger
 * /api/tools:
 *   get:
 *     summary: Get all tools
 *     tags: [Tools]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: pricing
 *         schema:
 *           type: string
 *         description: Filter by pricing (free, freemium, paid)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: Tools retrieved successfully
 */
router.get('/', listToolsValidator, toolController.getTools);

/**
 * @swagger
 * /api/tools/featured:
 *   get:
 *     summary: Get featured tools
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Featured tools retrieved
 */
router.get('/featured', toolController.getFeaturedTools);

/**
 * @swagger
 * /api/tools/bookmarks:
 *   get:
 *     summary: Get user's bookmarked tools
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarked tools retrieved
 */
router.get('/bookmarks', protect, toolController.getBookmarkedTools);

/**
 * @swagger
 * /api/tools/category/{category}:
 *   get:
 *     summary: Get tools by category
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Tools retrieved by category
 */
router.get('/category/:category', toolController.getToolsByCategory);

/**
 * @swagger
 * /api/tools/{id}:
 *   get:
 *     summary: Get single tool
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool retrieved successfully
 *       404:
 *         description: Tool not found
 */
router.get('/:id', toolIdValidator, toolController.getTool);

/**
 * @swagger
 * /api/tools:
 *   post:
 *     summary: Create a new tool
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - url
 *               - category
 *               - pricing
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               category:
 *                 type: string
 *               pricing:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               logo:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tool created successfully
 */
router.post('/', protect, adminOnly, createToolValidator, toolController.createTool);

/**
 * @swagger
 * /api/tools/{id}:
 *   put:
 *     summary: Update a tool
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tool updated successfully
 */
router.put('/:id', protect, adminOnly, updateToolValidator, toolController.updateTool);

/**
 * @swagger
 * /api/tools/{id}:
 *   delete:
 *     summary: Delete a tool
 *     tags: [Tools]
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
 *         description: Tool deleted successfully
 */
router.delete('/:id', protect, adminOnly, toolIdValidator, toolController.deleteTool);

/**
 * @swagger
 * /api/tools/{id}/bookmark:
 *   post:
 *     summary: Toggle bookmark on a tool
 *     tags: [Tools]
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
 *         description: Bookmark toggled
 */
router.post('/:id/bookmark', protect, toolIdValidator, toolController.bookmarkTool);

module.exports = router;
