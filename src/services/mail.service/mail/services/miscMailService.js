const nodemailerTransporter = require('../transporters/nodemailerTransport');
const sendgridTransporter = require('../transporters/sendgridTransport');
const { logger } = require('../../../../middlewares/logger');
const { referralMailTemplate } = require('../templates/referralMail');
const PROVIDER = process.env.MAIL_PROVIDER || 'nodemailer';

class MiscMailService {
    static async sendReferralEmail(data) {
        const mailOptions = referralMailTemplate(data);
        let sender = '"Root" <sakne.connect@gmail.com';
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

module.exports = MiscMailService;
