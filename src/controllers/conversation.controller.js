const { Op, Sequelize } = require('sequelize');
const { Message, Conversation } = require('../database/models/index');
const { InternalServerError } = require('../utils/error');

class ConversationController {
    // Get conversation list for a user
    static async getConversations(req, res) {
        try {
            const userId = req.authPayload.user.id;

            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [{ userId1: userId }, { userId2: userId }],
                },
                include: [
                    {
                        model: Message,
                        where: {
                            id: { [Op.eq]: Sequelize.col('Conversation.last_message_id') },
                        },
                        required: false, // If there's no message, it will still return the conversation
                    },
                ],
                order: [['updatedAt', 'DESC']], // Order conversations by most recently updated
            });

            if (!conversations || conversations.length === 0) {
                throw new InternalServerError('No conversations found');
            }

            res.status(200).json({
                status: 'success',
                data: conversations,
            });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            res.status(500).json({
                status: 'error',
                message: error.message || 'Internal Server Error',
            });
        }
    }
}

module.exports = ConversationController;
