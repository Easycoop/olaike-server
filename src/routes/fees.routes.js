const express = require('express');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const FeesController = require('../controllers/fees.controller');
const router = express.Router();

router.post('/', verifyAuth(AuthTokenType.Access), FeesController.createFee); // Create a Fee entry
router.get('/', verifyAuth(AuthTokenType.Access), FeesController.getFees); // Get Fees with optional filtering
router.delete('/:id', verifyAuth(AuthTokenType.Access), FeesController.deleteFee); // Delete a specific Fee by ID

module.exports = { router };
