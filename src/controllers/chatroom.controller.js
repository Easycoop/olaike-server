// controllers/chatroomController.js

const ChatroomService = require('../helpers/chatroom/chatroom.service');

class ChatroomController {
    static async createChatroom(req, res) {
        const { name, type } = req.body;

        try {
            const chatroom = await ChatroomService.createChatroom(name, type);
            res.status(201).json({
                status: 'success',
                data: chatroom,
                message: 'Chatroom created successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async addUser(req, res) {
        const { chatroomId, userId } = req.body;

        try {
            const response = await ChatroomService.addUserToChatroom(chatroomId, userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async getChatrooms(req, res) {
        try {
            const chatrooms = await ChatroomService.getChatrooms();
            res.status(200).json({
                status: 'success',
                data: chatrooms,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

module.exports = ChatroomController;
