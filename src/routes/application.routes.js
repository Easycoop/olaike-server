const express = require('express');
const router = express.Router();
const UserApplicationsController = require('../controllers/applications/user.application');

router
    .post('/user-application', UserApplicationsController.newUserApplication)
    .get('/', UserApplicationsController.getAllUserApplications)
    .get('/user/:applicationId', UserApplicationsController.getSingleUserApplication)
    .post('/update', UserApplicationsController.updateUserApplication);

module.exports = { router };
