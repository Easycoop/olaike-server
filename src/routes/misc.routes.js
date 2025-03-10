const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles, checkPermissions } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const MiscController = require('../controllers/misc.controller');

router
    .get('/init-roles-permissions', MiscController.initializeRolesandPermissions)
    .get('/init-create-master-group', MiscController.createMasterGroup)
    .post('/init-create-super-admin', MiscController.createSuperAdmin)
    .post('/send-referral-email', MiscController.sendReferralEmail)
    .get('/dashboard-data', verifyAuth(AuthTokenType.Access), MiscController.getAdminDashboardData);

module.exports = { router };
