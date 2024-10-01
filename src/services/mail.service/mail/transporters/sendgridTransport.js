const sgMail = require('@sendgrid/mail');
const mailConfig = require('../../config/mailConfig');
// const mailConfig = require('../../config');

sgMail.setApiKey(mailConfig.sendgrid.apiKey);

module.exports = sgMail;
