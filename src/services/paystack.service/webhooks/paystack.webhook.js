const db = require('../../../database/models');
const Subscription = db.subscription;
const Transaction = db.Transaction;
const { verifyPaystackSignature } = require('../utils/verify.paystack.signature');

/**
 * Handles Paystack webhook events.
 * @param {object} req - Express request object containing webhook payload
 * @param {object} res - Express response object
 */
const paystackWebhook = async (req, res) => {
    const signature = req.headers['x-paystack-signature'];

    if (!verifyPaystackSignature(req.body, signature)) {
        return res.status(400).json({ message: 'Invalid Paystack signature' });
    }

    const event = req.body.event;
    const data = req.body.data;

    switch (event) {
        case 'charge.success':
            // Handle payment success
            await TransactionSuccess(data);
            break;
        case 'charge.failed':
            // Handle payment failure
            await TransactionFailed(data);
            break;
        case 'subscription.create':
            // Handle subscription created
            await SubscriptionCreated(data.data);
            break;
        case 'subscription.disable':
            // Handle subscription disable
            await SubscriptionDisable(data.data);
            break;
        case 'subscription.expiry_cards':
            //Handle subscription expiry cards
            await SubscriptionExpiringCards(data.data);
            break;
        case 'subscription.not_renew':
            // Handle subscription not renew
            await SubscriptionNotRenew(data.data);
            break;

        default:
            console.error(`Unhandled event: ${event}`);
    }

    res.status(200).json({ message: 'Webhook processed' });
};

//Handle transaction events
const TransactionSuccess = async (data) => {
    const reference = data.reference;
    const transaction = await Transaction.findOne({ where: { reference: reference } });
    transaction.status = 'success';
    await transaction.save();
};

const TransactionFailed = async (data) => {
    const reference = data.reference;
    const transaction = await Transaction.findOne({ where: { reference: reference } });
    transaction.status = 'failed';
    await transaction.save();
};

// Handle subsciption events
const SubscriptionCreated = async (data) => {
    const plan_code = data.plan.plan_code;
    const subscription = await Subscription.findOne({ where: { code: plan_code } });
    subscription.status = 'active';
    await subscription.save();
};

const SubscriptionDisable = async (data) => {
    const plan_code = data.plan.plan_code;
    const subscription = await Subscription.findOne({ where: { code: plan_code } });
    subscription.status = 'disabled';
    await subscription.save();
};
const SubscriptionExpiringCards = () => {};

const SubscriptionNotRenew = async (data) => {
    const plan_code = data.plan.plan_code;
    const subscription = await Subscription.findOne({ where: { code: plan_code } });
    subscription.status = 'not renewing';
    await subscription.save();
};

module.exports = paystackWebhook;
