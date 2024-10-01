const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles, checkPermissions } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const MiscController = require('../controllers/misc.controller');

router.get('/init-roles-permissions', MiscController.initializeRolesandPermissions);

module.exports = { router };
