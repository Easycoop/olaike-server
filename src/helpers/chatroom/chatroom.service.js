const { Chatroom } = require('../models');

class ChatroomService {
    static async createChatroom(name, type) {
        // Updated to include type
        try {
            const chatroom = await Chatroom.create({ name, type });
            return chatroom;
        } catch (error) {
            console.error('Failed to create chatroom:', error.message);
            throw new Error('Chatroom creation failed');
        }
    }

    static async addUserToChatroom(chatroomId, userId) {
        try {
            const chatroom = await Chatroom.findByPk(chatroomId);
            if (!chatroom) {
                throw new Error('Chatroom not found');
            }
            await chatroom.addUser(userId);
            return { message: 'User added to chatroom successfully' };
        } catch (error) {
            console.error('Failed to add user to chatroom:', error.message);
            throw new Error('Adding user to chatroom failed');
        }
    }

    static async getChatrooms() {
        try {
            const chatrooms = await Chatroom.findAll();
            return chatrooms;
        } catch (error) {
            console.error('Failed to fetch chatrooms:', error.message);
            throw new Error('Chatroom retrieval failed');
        }
    }
}

module.exports = ChatroomService;
