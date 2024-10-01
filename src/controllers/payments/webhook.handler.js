const Paystack = require('../../services/paystack.service');

/**
 * Central webhook handler for dispatching webhooks to their respective handlers.
 * @param {string} provider - The name of the provider (e.g., 'paystack')
 * @param {object} req - Express request object containing webhook data
 * @param {object} res - Express response object
 */
const handleWebhook = (provider, req, res) => {
    switch (provider) {
        case 'paystack':
            return Paystack.HandleEvent(req, res);
        default:
            res.status(400).json({ message: 'Unknown webhook provider' });
    }
};

module.exports = { handleWebhook };
