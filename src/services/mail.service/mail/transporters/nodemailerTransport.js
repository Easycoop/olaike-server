const nodemailer = require('nodemailer');
const mailConfig = require('../../config/mailConfig');
// const mailConfig = require('../../config');
const transporter = nodemailer.createTransport({
    service: mailConfig.nodemailer.service,
    host: mailConfig.nodemailer.host,
    port: mailConfig.nodemailer.port,
    secure: mailConfig.nodemailer.secure, // true for 465, false for other ports
    auth: {
        user: mailConfig.nodemailer.auth.user,
        pass: mailConfig.nodemailer.auth.pass,
    },
});

module.exports = transporter;
