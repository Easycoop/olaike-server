// routes/chatroomRoutes.js
const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const ChatroomController = require('../controllers/chatroom.controller');

// Create a chatroom
router.post('/', verifyAuth(AuthTokenType.Access), ChatroomController.createChatroom);

// Add a user to a chatroom
router.post('/addUser', verifyAuth(AuthTokenType.Access), ChatroomController.addUser);

// Get all chatrooms
router.get('/', verifyAuth(AuthTokenType.Access), ChatroomController.getChatrooms);

module.exports = router;
