const express = require('express');
const router = express.Router();

const { checkRoles } = require('../middlewares/role.permission');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');
const LoanApplicationController = require('../controllers/applications/loan.application');

router.post('/', verifyAuth(AuthTokenType.Access), LoanApplicationController.submitLoan);

router.patch('/', verifyAuth(AuthTokenType.Access), LoanApplicationController.saveChanges);

router.delete('/:applicationId', verifyAuth(AuthTokenType.Access), LoanApplicationController.deleteApplication);

router.get('/:applicationId', verifyAuth(AuthTokenType.Access), LoanApplicationController.getApplication);

router.get('/', verifyAuth(AuthTokenType.Access), LoanApplicationController.getAllUserApplicationsByGroups);

module.exports = { router };
