const { Message } = require('../../database/models/index');
const Op = require('sequelize').Op;

class MessageService {
    static async sendMessage(senderId, recipientId, content, fileUrl = null) {
        try {
            const message = await Message.create({
                senderId,
                recipientId,
                content,
                fileUrl,
            });
            return message;
        } catch (error) {
            console.error('Failed to send message:', error.message);
            throw new Error('Message sending failed');
        }
    }

    static async getMessagesBetweenUsers(userId1, userId2) {
        try {
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId1, recipientId: userId2 },
                        { senderId: userId2, recipientId: userId1 },
                    ],
                },
                order: [['createdAt', 'ASC']],
            });

            if (!messages) {
                return null;
            }
            return messages;
        } catch (error) {
            console.error('Failed to fetch messages:', error.message);
            throw new Error('Message retrieval failed');
        }
    }

    static async markMessageAsRead(messageId) {
        try {
            await Message.update({ readStatus: true }, { where: { id: messageId } });
        } catch (error) {
            console.error('Failed to mark message as read:', error.message);
            throw new Error('Marking message as read failed');
        }
    }
}

module.exports = MessageService;
