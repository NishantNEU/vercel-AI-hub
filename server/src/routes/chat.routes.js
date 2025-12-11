/**
 * @fileoverview Chat routes
 * @description API endpoints for AI chat functionality
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  createChatValidator,
  sendMessageValidator,
  chatIdValidator,
  listChatsValidator,
  updateChatValidator
} = require('../validators/chat.validator');

/**
 * @swagger
 * /api/chats/helper:
 *   post:
 *     summary: Public AI Learning Guide helper (no auth required)
 *     tags: [Chats]
 *     description: AI-powered helper for guiding visitors about courses, tools, and learning paths
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question or message
 *                 example: "What courses should I start with?"
 *               context:
 *                 type: string
 *                 description: Context identifier (optional)
 *                 example: "learning_guide"
 *     responses:
 *       200:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     response:
 *                       type: string
 */
router.post('/helper', chatController.helperChat);

// All other chat routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats for current user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 */
router.get('/', listChatsValidator, chatController.getChats);

/**
 * @swagger
 * /api/chats/quick:
 *   post:
 *     summary: Quick chat - create and send message in one request
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               model:
 *                 type: string
 *                 enum: [gemini-1.5-flash, gemini-1.5-pro]
 *               mode:
 *                 type: string
 *                 enum: [general, tutor, coder, summarizer]
 *     responses:
 *       201:
 *         description: Chat created with AI response
 */
router.post('/quick', chatController.quickChat);

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               mode:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat created successfully
 */
router.post('/', createChatValidator, chatController.createChat);

/**
 * @swagger
 * /api/chats:
 *   delete:
 *     summary: Clear all chats
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All chats deleted
 */
router.delete('/', chatController.clearAllChats);

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Get single chat with messages
 *     tags: [Chats]
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
 *         description: Chat retrieved
 */
router.get('/:id', chatIdValidator, chatController.getChat);

/**
 * @swagger
 * /api/chats/{id}:
 *   put:
 *     summary: Update chat title
 *     tags: [Chats]
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
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat updated
 */
router.put('/:id', updateChatValidator, chatController.updateChat);

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Delete a chat
 *     tags: [Chats]
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
 *         description: Chat deleted
 */
router.delete('/:id', chatIdValidator, chatController.deleteChat);

/**
 * @swagger
 * /api/chats/{id}/message:
 *   post:
 *     summary: Send message and get AI response
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent and AI responded
 */
router.post('/:id/message', sendMessageValidator, chatController.sendMessage);

module.exports = router;
