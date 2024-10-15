const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const UserController = require('../controllers/user.controller');

router
    .get('/', UserController.getAllUsers)
    .get('/group', verifyAuth(AuthTokenType.Access), UserController.getAllUsersByGroups)
    .get('/user', verifyAuth(AuthTokenType.Access), UserController.getLoggedInUser)
    .get('/user/:id', verifyAuth(AuthTokenType.Access), UserController.getUser)
    .delete('/user/:id', verifyAuth(AuthTokenType.Access), checkRoles('admin'), UserController.deleteUser)
    .post('/', verifyAuth(AuthTokenType.Access), UserController.createUser)
    .put('/', verifyAuth(AuthTokenType.Access), UserController.updateUser);

module.exports = { router };
