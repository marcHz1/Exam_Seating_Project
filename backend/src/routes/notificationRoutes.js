const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authStudent, authAny } = require('../middleware/auth');

router
  .route('/')
  .post(authAny, notificationController.createNotification)
  .get(authAny, notificationController.getNotifications);

// FIXED: Now forces student_id from token
router.get('/my-inbox', authStudent, notificationController.getMyNotifications);

router
  .route('/:notificationId')
  .get(authStudent, notificationController.getNotification)
  .patch(authStudent, notificationController.markAsRead);

module.exports = router;