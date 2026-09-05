const Joi = require('joi');
const { objectId } = require('./custom');

const createNotification = {
  body: Joi.object().keys({
    student_id: Joi.string().custom(objectId).required(),
    seat_assignment_id: Joi.string().custom(objectId).required(),
    channel: Joi.string().valid('email', 'sms', 'in_app').required(),
    message: Joi.string().max(1000).required(),
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    student_id: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'sent', 'failed', 'read'),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(0),
    page: Joi.number().integer().min(0),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId).required(),
  }),
};

const markAsRead = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
};
