const express = require('express');
const ConversationController = require('../controllers/conversation.controller');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const router = express.Router();

// Get conversations
router.get('/', verifyAuth(AuthTokenType.Access), ConversationController.getConversations);

module.exports = { router };
