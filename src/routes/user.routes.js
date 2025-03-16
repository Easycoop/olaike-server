const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAuth } = require('../middlewares/auth');
const { checkRoles } = require('../middlewares/role.permission');
const { AuthTokenType } = require('../utils/token');
const UserController = require('../controllers/user.controller');
const upload = multer();

router
    // .post('/verify-nin', multer(''))
    .get('/', UserController.getAllUsers)
    .post('/:id/phone-verification', verifyAuth(AuthTokenType.Access), UserController.verifyPhone)
    .post('/:id/verify-phone', verifyAuth(AuthTokenType.Access), UserController.verifyPhoneOtp)
    .post('/:id/verify-nin', verifyAuth(AuthTokenType.Access), upload.single('image'), UserController.verifyNin)
    .get('/:id/get-nin', verifyAuth(AuthTokenType.Access), UserController.getNin)
    .get('/group', verifyAuth(AuthTokenType.Access), UserController.getAllUsersByGroups)
    .get('/user', verifyAuth(AuthTokenType.Access), UserController.getLoggedInUser)
    .get('/user/:id', verifyAuth(AuthTokenType.Access), UserController.getUser)
    .delete('/user/:id', verifyAuth(AuthTokenType.Access), checkRoles('admin'), UserController.deleteUser)
    .post('/', verifyAuth(AuthTokenType.Access), UserController.createUser)
    .put('/', verifyAuth(AuthTokenType.Access), UserController.updateUser);

module.exports = { router };
