const { handleWebhook } = require('./webhook.handler');

const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER;

class WebhookController {
    static async Webhook(req, res) {
        handleWebhook(PAYMENT_PROVIDER, req, res);
    }
}

module.exports = WebhookController;
