const { Notification, User } = require('../../database/models/index');
const nodemailer = require('nodemailer');

class NotificationService {
    static async createNotification({ message, userId, ticketId = null }) {
        try {
            const notification = await Notification.create({
                message,
                userId,
                ticketId,
            });

            // Fetch the user to get their email
            const user = await User.findByPk(userId);

            // Send an email notification
            if (user && user.email) {
                await this.sendEmailNotification(user.email, message);
            }
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    }

    static async sendEmailNotification(email, message) {
        // Setup your email transport (SMTP, etc.)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Notification from Ticket System',
            text: message,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    }
}

module.exports = NotificationService;

// EXAMPLE USAGE

// await NotificationService.createNotification({
//   message: `Beneficiary Simon Peter has been added to your account.`,
//   userId,
// });
