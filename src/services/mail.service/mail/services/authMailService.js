const nodemailerTransporter = require('../transporters/nodemailerTransport');
const sendgridTransporter = require('../transporters/sendgridTransport');
const { logger } = require('../../../../middlewares/logger');
const {
    emailConfirmationLinkTemplate,
    emailConfirmationOtpTemplate,
    passwordResetEmailTemplate,
    registrationTemplate,
    registrationActionTemplate,
} = require('../templates/authMail');
const PROVIDER = process.env.MAIL_PROVIDER || 'nodemailer';

class AuthMailService {
    static async sendVerificationLink(user) {
        const mailOptions = emailConfirmationLinkTemplate(user);
        let sender = '"Olaike" <sakne.connect@gmail.com';
        const msg = {
            from: sender,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
        };

        try {
            switch (PROVIDER) {
                case 'sendgrid':
                    await sendgridTransporter.send(msg);
                    break;

                case 'nodemailer':
                    nodemailerTransporter.sendMail(msg, function (error, response) {
                        if (error) {
                            logger.log(error);
                        } else {
                            logger.log('mail sent successfully');
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown mail provider: ${PROVIDER}`);
            }
        } catch (error) {
            logger.error(`Failed to send email via ${PROVIDER}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    static async sendVerificationOtp(user) {
        const mailOptions = emailConfirmationOtpTemplate(user);
        let sender = '"Olaike" <sakne.connect@gmail.com';
        const msg = {
            from: sender,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
        };

        try {
            switch (PROVIDER) {
                case 'sendgrid':
                    await sendgridTransporter.send(msg);
                    break;

                case 'nodemailer':
                    nodemailerTransporter.sendMail(msg, function (error, response) {
                        if (error) {
                            logger.log(error);
                        } else {
                            logger.log('message sent');
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown mail provider: ${PROVIDER}`);
            }
        } catch (error) {
            logger.error(`Failed to send email via ${PROVIDER}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    static async sendResetPasswordOtp(user) {
        const mailOptions = passwordResetEmailTemplate(user);
        let sender = '"Olaike" <sakne.connect@gmail.com';
        const msg = {
            from: sender,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
        };

        try {
            switch (PROVIDER) {
                case 'sendgrid':
                    await sendgridTransporter.send(msg);
                    break;

                case 'nodemailer':
                    nodemailerTransporter.sendMail(msg, function (error, response) {
                        if (error) {
                            logger.log(error);
                        } else {
                            logger.log('message sent');
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown mail provider: ${PROVIDER}`);
            }
        } catch (error) {
            logger.error(`Failed to send email via ${PROVIDER}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    static async sendRegistrationComplete(user) {
        const mailOptions = registrationTemplate(user);
        let sender = '"Olaike" <sakne.connect@gmail.com';
        const msg = {
            from: sender,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
        };

        try {
            switch (PROVIDER) {
                case 'sendgrid':
                    await sendgridTransporter.send(msg);
                    break;

                case 'nodemailer':
                    nodemailerTransporter.sendMail(msg, function (error, response) {
                        if (error) {
                            logger.log(error);
                        } else {
                            logger.log('message sent');
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown mail provider: ${PROVIDER}`);
            }
        } catch (error) {
            logger.error(`Failed to send email via ${PROVIDER}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    static async sendRegistrationAction(user) {
        const mailOptions = registrationActionTemplate(user);
        let sender = '"Olaike" <sakne.connect@gmail.com';
        const msg = {
            from: sender,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
        };

        try {
            switch (PROVIDER) {
                case 'sendgrid':
                    await sendgridTransporter.send(msg);
                    break;

                case 'nodemailer':
                    nodemailerTransporter.sendMail(msg, function (error, response) {
                        if (error) {
                            logger.log(error);
                        } else {
                            logger.log('message sent');
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown mail provider: ${PROVIDER}`);
            }
        } catch (error) {
            logger.error(`Failed to send email via ${PROVIDER}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

module.exports = AuthMailService;
