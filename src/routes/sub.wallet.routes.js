const express = require('express');
const SubWalletController = require('../controllers/sub.wallet.controller');
const { AuthTokenType } = require('../utils/token');
const { verifyAuth } = require('../middlewares/auth');
const router = express.Router();

// Create a new sub-wallet
router.post('/:walletId/subwallets', verifyAuth(AuthTokenType.Access), SubWalletController.createSubWallet);

// Get all sub-wallets for a user's wallet
router.get('/:walletId/subwallets', verifyAuth(AuthTokenType.Access), SubWalletController.getAllSubWallets);

// Get a specific sub-wallet by ID
router.get('/:walletId/subwallets/:subWalletId', verifyAuth(AuthTokenType.Access), SubWalletController.getSubWallet);

// Get total balance for a main wallet (including sub-wallets)
router.get('/:walletId/totalbalance', verifyAuth(AuthTokenType.Access), SubWalletController.getTotalBalance);

// Transfer funds to a sub-wallet
router.post(
    '/:walletId/subwallets/:subWalletId/transfer',
    verifyAuth(AuthTokenType.Access),
    SubWalletController.transferFunds,
);

// Transfer funds between sub-wallets
router.post(
    '/:walletId/subwallets/:subWalletId/transfer-to/:targetSubWalletId',
    verifyAuth(AuthTokenType.Access),
    SubWalletController.transferFundsBetweenSubWallets,
);

// Get default sub-wallet
router.get('/:walletId/subwallets/default', verifyAuth(AuthTokenType.Access), SubWalletController.getDefaultSubWallet);

// Update a specific sub-wallet by ID
router.put('/:walletId/subwallets/:subWalletId', verifyAuth(AuthTokenType.Access), SubWalletController.updateSubWallet);

// Delete a specific sub-wallet by ID
router.delete(
    '/:walletId/subwallets/:subWalletId',
    verifyAuth(AuthTokenType.Access),
    SubWalletController.deleteSubWallet,
);

module.exports = { router };
