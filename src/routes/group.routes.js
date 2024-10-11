const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const GroupController = require('../controllers/group.controller');

router
    .get(
        '/',
        // verifyAuth(AuthTokenType.Access),
        GroupController.getAllGroups,
    )
    .post(
        '/',
        // verifyAuth(AuthTokenType.Access),
        GroupController.createGroup,
    );

module.exports = { router };
