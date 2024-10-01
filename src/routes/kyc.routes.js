const express = require('express');
const router = express.Router();

const KycController = require('../controllers/kyc.controller');
const { checkRoles } = require('../middlewares/role.permission');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

router.post('/', verifyAuth(AuthTokenType.Access), KycController.createKyc); // Create a new KYC
router.get('/:userId', verifyAuth(AuthTokenType.Access), KycController.getKycByUserId); // Get KYC by user ID
router.get('/', verifyAuth(AuthTokenType.Access), KycController.getAllKyc); // Get all KYC records
router.patch('/:userId', verifyAuth(AuthTokenType.Access), KycController.updateKycStatus); // Update KYC status
router.delete('/:userId', verifyAuth(AuthTokenType.Access), KycController.deleteKyc); // Delete KYC record

module.exports = { router };
