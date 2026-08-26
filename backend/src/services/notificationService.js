const Notification = require('../models/Notification');
const SeatAssignment = require('../models/SeatAssignment');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

// Lazy-load queue to avoid circular deps if queue not ready
let notificationQueue;
const getQueue = () => {
  if (!notificationQueue) {
    notificationQueue = require('../jobs/notificationQueue');
  }
  return notificationQueue;
};

const createNotification = async (body) => {
  const notification = await Notification.create(body);

  // If email or sms, queue for async delivery
  if (body.channel === 'email' || body.channel === 'sms') {
    try {
      getQueue().add('send-notification', { notificationId: notification._id.toString() });
    } catch (err) {
      logger.error('Failed to queue notification', err);
    }
  }

  return notification;
};

const queryNotifications = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const notifications = await Notification.find(filter)
    .populate('student_id', 'full_name email phone')
    .populate('seat_assignment_id')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Notification.countDocuments(filter);
  return { notifications, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getNotificationById = async (id) => {
  return Notification.findById(id).populate('student_id seat_assignment_id');
};

const markAsRead = async (id) => {
  const notification = await getNotificationById(id);
  if (!notification) throw ApiError.notFound('Notification not found');
  notification.status = 'read';
  await notification.save();
  return notification;
};

const notifySeatAssignment = async (seatAssignmentId) => {
  const assignment = await SeatAssignment.findById(seatAssignmentId)
    .populate('student_id')
    .populate('exam_id')
    .populate('seat_id');

  if (!assignment) throw ApiError.notFound('Seat assignment not found');

  const student = assignment.student_id;
  const seat = assignment.seat_id;
  const exam = assignment.exam_id;

  const message = `Your exam seat has been assigned. Exam: ${exam._id}, Seat: ${seat.seat_label}. Please arrive 15 minutes early.`;

  // Create in-app notification
  await createNotification({
    student_id: student._id,
    seat_assignment_id: seatAssignmentId,
    channel: 'in_app',
    message,
    status: 'sent',
    sent_at: new Date(),
  });

  // Queue email
  if (student.email) {
    await createNotification({
      student_id: student._id,
      seat_assignment_id: seatAssignmentId,
      channel: 'email',
      message,
      status: 'pending',
    });
  }

  return { message: 'Notifications queued' };
};

module.exports = {
  createNotification,
  queryNotifications,
  getNotificationById,
  markAsRead,
  notifySeatAssignment,
};
