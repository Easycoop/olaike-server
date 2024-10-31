const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const WithdrawRequestController = require('../controllers/withdraw.request.controller');

router.post('/', verifyAuth(AuthTokenType.Access), WithdrawRequestController.request);

router.delete('/:requestId', verifyAuth(AuthTokenType.Access), WithdrawRequestController.deleteRequest);

router.get('/:requestId', verifyAuth(AuthTokenType.Access), WithdrawRequestController.getRequest);

router.get('/', verifyAuth(AuthTokenType.Access), WithdrawRequestController.getAllWithdrawRequestsByGroups);

router.post('/update', verifyAuth(AuthTokenType.Access), WithdrawRequestController.updateRequest);

module.exports = { router };
