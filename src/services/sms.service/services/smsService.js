const twilioClient = require('../transporters/twilioTransport');

const sendSmsWithTwilio = async (to, message) => {
    try {
        const messageResponse = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });
        return messageResponse;
    } catch (error) {
        throw new Error(`Failed to send SMS: ${error.message}`);
    }
};

module.exports = {
    sendSmsWithTwilio,
};
