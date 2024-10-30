const express = require('express');
const router = express.Router();

const { AuthTokenType } = require('../utils/token');
const { verifyAuth, AuthenticatedController } = require('../middlewares/auth');
const WebhookController = require('../controllers/payments/webhook.controller');
const TransactionController = require('../controllers/payments/transaction.controller');
const SubscriptionController = require('../controllers/payments/subscription.controller');

router
    .post(
        '/initialize',
        verifyAuth(AuthTokenType.Access),
        AuthenticatedController(TransactionController.initiatePayment),
    )
    .post('/initialize-entry', AuthenticatedController(TransactionController.initiatePaymentEntry))
    .get(
        '/verify/:reference',
        verifyAuth(AuthTokenType.Access),
        AuthenticatedController(TransactionController.verifyTransaction),
    )
    .get(
        '/verify-fund/:reference',
        verifyAuth(AuthTokenType.Access),
        AuthenticatedController(TransactionController.verifyTransactionFund),
    )
    .get('/verify-entry/:reference', AuthenticatedController(TransactionController.verifyTransactionEntry))
    .get('/verify-savings/:reference', AuthenticatedController(TransactionController.verifyTransactionSavings))
    .get('/verify-loan/:reference', AuthenticatedController(TransactionController.verifyTransactionLoan))
    .post(
        '/create-subscription-plan',
        verifyAuth(AuthTokenType.Access),
        AuthenticatedController(SubscriptionController.CreatePlan),
    )
    .get('/webhook', verifyAuth(AuthTokenType.Access), AuthenticatedController(WebhookController.Webhook));

module.exports = { router };
