const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const TransactionController = require('../controllers/transaction.controller');

router.get('/wallets', verifyAuth(AuthTokenType.Access), TransactionController.getAllTransactions);

module.exports = { router };
