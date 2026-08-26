const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const notificationValidation = require('../validations/notificationValidation');
const notificationController = require('../controllers/notificationController');
const { authAdmin, authStudent } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, validate(notificationValidation.createNotification), notificationController.createNotification)
  .get(authAdmin, validate(notificationValidation.getNotifications), notificationController.getNotifications);

// Student inbox
router.get('/my-inbox', authStudent, notificationController.getNotifications);

router
  .route('/:notificationId')
  .get(authStudent, validate(notificationValidation.getNotification), notificationController.getNotification)
  .patch(authStudent, validate(notificationValidation.markAsRead), notificationController.markAsRead);

module.exports = router;
