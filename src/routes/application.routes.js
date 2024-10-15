const express = require('express');
const router = express.Router();
const UserApplicationsController = require('../controllers/applications/user.application');
const { verifyAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

router
    .post('/user-application', UserApplicationsController.newUserApplication)
    .get('/', verifyAuth(AuthTokenType.Access), UserApplicationsController.getAllUserApplications)
    .get('/group', verifyAuth(AuthTokenType.Access), UserApplicationsController.getAllUserApplicationsByGroups)
    .get('/user/:applicationId', verifyAuth(AuthTokenType.Access), UserApplicationsController.getSingleUserApplication)
    .post('/update', verifyAuth(AuthTokenType.Access), UserApplicationsController.updateUserApplication);

module.exports = { router };
