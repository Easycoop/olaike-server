const { Message, Conversation, User } = require('../../database/models/index');
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
            const conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        { userId1: senderId, userId2: recipientId },
                        { userId2: senderId, userId1: recipientId },
                    ],
                },
            });

            if (conversation) {
                // Update lastMessageId in Conversation
                await conversation.update({ lastMessageId: message.id, lastMessageContent: message.content });
                await conversation.save();
            } else {
                console.log(3);

                const user1 = await User.findOne({ where: { id: senderId } });
                const user2 = await User.findOne({ where: { id: recipientId } });

                await Conversation.create({
                    userId1: senderId,
                    userId2: recipientId,
                    userId1Name: `${user1.firstName} ${user1.lastName}`,
                    userId2Name: `${user2.firstName} ${user2.lastName}`,
                    lastMessageId: message.id,
                    lastMessageContent: message.content,
                });
            }

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
