const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const notificationService = require('../services/notificationService');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  res.status(201).json({ success: true, data: notification });
});

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['student_id', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await notificationService.queryNotifications(filter, options);
  res.json({ success: true, data: result });
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.json({ success: true, data: notification });
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.notificationId);
  res.json({ success: true, data: notification });
});

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
};
