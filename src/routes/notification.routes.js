// routes/notificationRoutes.js
const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const router = express.Router();

// Get all notifications for the logged-in user
router.get('/notifications', NotificationController.getNotifications);

// Mark a notification as read
router.patch('/notifications/:id/read', NotificationController.markAsRead);

module.exports = { router };
