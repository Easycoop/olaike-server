// routes/logRoutes.js
const express = require('express');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const LogController = require('../controllers/logs.controller');
const router = express.Router();

router.post('/', verifyAuth(AuthTokenType.Access), LogController.createLog); // Create a log entry
router.get('/', verifyAuth(AuthTokenType.Access), LogController.getLogs); // Get logs with optional filtering
router.delete('/:id', verifyAuth(AuthTokenType.Access), LogController.deleteLog); // Delete a specific log by ID

module.exports = router;
