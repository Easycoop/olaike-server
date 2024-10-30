const MessageService = require('../helpers/messages/messages.service');
const { Message, User } = require('../database/models/index');
const Op = require('sequelize').Op;

class MessageController {
    static async sendMessage(req, res) {
        const { recipientId, content, fileUrl } = req.body;
        // const { userId } = req.user; // scenerio when the userId is passed in the body

        const userId = req.authPayload.user.id;

        try {
            const message = await MessageService.sendMessage(userId, recipientId, content, fileUrl);
            res.status(201).json({
                status: 'success',
                data: message,
                message: 'Message sent successfully',
            });
            // Emit message via Socket.io
            io.emit('message', message);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async markAsRead(req, res) {
        const { messageId } = req.params;

        try {
            await MessageService.markMessageAsRead(messageId);
            res.status(200).json({
                status: 'success',
                message: 'Message marked as read successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async getMessages(req, res) {
        const { userId1, userId2 } = req.params;

        try {
            const messages = await MessageService.getMessagesBetweenUsers(userId1, userId2);
            res.status(200).json({
                status: 'success',
                data: messages,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async getAllMessagesForUser(req, res) {
        try {
            const { id } = req.authPayload.user; // Get userId from request params

            // Find all messages where the user is either the sender or receiver
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [{ senderId: id }, { recipientId: id }],
                },
                // include: [
                //     { model: User, as: 'sender', attributes: ['id', 'name'] },
                //     { model: User, as: 'receiver', attributes: ['id', 'name'] },
                // ],
                order: [['createdAt', 'ASC']], // Sort messages by creation time
            });

            res.status(200).json({ status: 'success', data: messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    }
}

module.exports = MessageController;
