const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const RolePermissions = require('../controllers/role.permission.controller');

router
    .get('/roles', verifyAuth(AuthTokenType.Access), RolePermissions.getRoles)
    .post('/create-role', verifyAuth(AuthTokenType.Access), RolePermissions.createRole)
    .post('/create-permission', verifyAuth(AuthTokenType.Access), RolePermissions.createPermission)
    .post('/assign-permission-to-role', verifyAuth(AuthTokenType.Access), RolePermissions.assignPermissionToRole)
    .post('/assign-permission-to-user', verifyAuth(AuthTokenType.Access), RolePermissions.assignPermissionToUser)
    .post('/assign-user-to-role', verifyAuth(AuthTokenType.Access), RolePermissions.assignUserToRole);

module.exports = { router };
