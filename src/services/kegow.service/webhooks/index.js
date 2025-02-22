/**
 * Handles Kegow webhook events.
 * @param {object} req - Express request object containing webhook payload
 * @param {object} res - Express response object
 */
const kegowWebhook = async (req, res) => {
    const event = req.body.transactionType;
    const data = req.body;

    switch (event) {
        case 'INWARD__TRANSFER_SUCCESS':
            handleInwardTransferSuccess(data);
            break;

        case 'OUTWARD__TRANSFER_SUCCESS':
            handleOutwardTransferSuccess(data);
            break;

        case 'OUTWARD__TRANSFER_FAILURE':
            handleOutwardTransferFailure(data);
            break;

        case 'SUBSCRIPTION_CREATED':
            handleSubscriptionCreated(data);
            break;

        case 'SUBSCRIPTION_DISABLED':
            handleSubscriptionDisabled(data);
            break;

        case 'SUBSCRIPTION_EXPIRING_CARDS':
            handleSubscriptionExpiringCards(data);
            break;

        case 'SUBSCRIPTION_NOT_RENEW':
            handleSubscriptionNotRenew(data);
            break;
        default:
            console.error(`Unhandled event: ${event}`);
    }

    res.status(200).json({ message: 'Webhook processed' });
};

const handleInwardTransferSuccess = (data) => {
    console.log('Inward Transfer Success:', data);
};

const handleOutwardTransferSuccess = (data) => {
    console.log('Outward Transfer Success:', data);
};

const handleOutwardTransferFailure = (data) => {
    console.log('Outward Transfer Failure:', data);
};

const handleSubscriptionCreated = (data) => {
    console.log('Subscription Created:', data);
};

const handleSubscriptionDisabled = (data) => {
    console.log('Subscription Disabled:', data);
};

const handleSubscriptionExpiringCards = (data) => {
    console.log('Subscription Expiring Cards:', data);
};

const handleSubscriptionNotRenew = (data) => {
    console.log('Subscription Not Renew:', data);
};

module.exports = kegowWebhook;