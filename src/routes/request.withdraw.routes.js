const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const RequestWithdrawController = require('../controllers/request.controller');

router.post('/', verifyAuth(AuthTokenType.Access), RequestWithdrawController.request);

module.exports = { router };
