const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const TransactionController = require('../controllers/transaction.controller');

router
    .get('/group', verifyAuth(AuthTokenType.Access), TransactionController.getAllTransactionsByGroups)
    .get('/wallet/:walletId', verifyAuth(AuthTokenType.Access), TransactionController.getWalletTransactions)
    .get('/user/:userId', verifyAuth(AuthTokenType.Access), TransactionController.getUserTransactions);

module.exports = { router };
