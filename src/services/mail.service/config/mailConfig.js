// const ENV = process.env.NODE_ENV || 'DEV';
const ENV = 'DEV';

const config = {
    DEV: {
        nodemailer: {
            service: 'gmail',
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        },
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY,
        },
    },
    PROD: {
        // nodemailer: {
        //     service: 'sendgrid',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         apiKey: process.env.SENDGRID_API_KEY,
        //     },
        // },
        nodemailer: {
            service: 'gmail',
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        },
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY,
        },
    },
};

module.exports = config[ENV];
