const twilio = require('twilio');
const smsConfig = require('../../config/smsConfig');

const twilioClient = twilio(smsConfig.twilio.accountSid, smsConfig.twilio.authToken);

module.exports = twilioClient;
