const db = require('../database/models/index');
const Notification = db.Notification;
const Ticket = db.Ticket;

class NotificationController {
    // Get all notifications for the logged-in user
    static async getNotifications(req, res) {
        const { userId } = req.user;

        try {
            const notifications = await Notification.findAll({
                where: { userId },
                include: [{ model: Ticket, as: 'Ticket', attributes: ['id', 'title'] }],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                data: notifications,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve notifications',
                error: error.message,
            });
        }
    }

    // Mark a notification as read
    static async markAsRead(req, res) {
        const { id } = req.params; // Notification ID

        try {
            const notification = await Notification.findByPk(id);

            if (!notification) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Notification not found',
                });
            }

            notification.isRead = true;
            await notification.save();

            res.status(200).json({
                status: 'success',
                message: 'Notification marked as read',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to mark notification as read',
                error: error.message,
            });
        }
    }
}

module.exports = NotificationController;
