const crypto = require('crypto');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Verifies the Paystack webhook signature.
 * @param {object} payload - Webhook payload data
 * @param {string} signature - Paystack signature from the headers
 * @returns {boolean} - Returns true if valid, false otherwise
 */
const verifyPaystackSignature = (payload, signature) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(payload)).digest('hex');

    return hash === signature;
};

module.exports = { verifyPaystackSignature };
