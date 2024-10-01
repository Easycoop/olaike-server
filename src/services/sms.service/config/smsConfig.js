const ENV = process.env.NODE_ENV || 'development';

const config = {
    development: {
        twilio: {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
            from: process.env.TWILIO_PHONE_NUMBER,
        },
    },
    production: {
        twilio: {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
            from: process.env.TWILIO_PHONE_NUMBER,
        },
    },
};

module.exports = config[ENV];
