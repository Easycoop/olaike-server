const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const WalletController = require('../controllers/wallet.controlller');

router.get('/wallets', verifyAuth(AuthTokenType.Access), WalletController.getAllWallets);

module.exports = { router };
