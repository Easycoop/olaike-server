// routes/messageRoutes.js
const express = require('express');
const router = express.Router();

const MessageController = require('../controllers/message.controller');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

// Send a message
router.post('/', verifyAuth(AuthTokenType.Access), MessageController.sendMessage);

// Get all messages for the authenticated user
router.get('/', verifyAuth(AuthTokenType.Access), MessageController.getAllMessagesForUser);

// Mark a message as read
router.patch('/:messageId/read', verifyAuth(AuthTokenType.Access), MessageController.markAsRead);

// Get messages between two users
router.get('/:userId1/:userId2', verifyAuth(AuthTokenType.Access), MessageController.getMessages);

module.exports = { router };
