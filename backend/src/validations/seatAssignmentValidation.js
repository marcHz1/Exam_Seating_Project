const Joi = require('joi');
const { objectId } = require('./custom');

const createSeatAssignment = {
  body: Joi.object().keys({
    student_id: Joi.string().custom(objectId).required(),
    exam_id: Joi.string().custom(objectId).required(),
    seat_id: Joi.string().custom(objectId).required(),
  }),
};

const bulkCreateSeatAssignment = {
  body: Joi.object().keys({
    student_ids: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
    exam_id: Joi.string().custom(objectId).required(),
    hall_id: Joi.string().custom(objectId).required(),
  }),
};

const getSeatAssignments = {
  query: Joi.object().keys({
    student_id: Joi.string().custom(objectId),
    exam_id: Joi.string().custom(objectId),
    attendance_status: Joi.string().valid('pending', 'present', 'absent', 'late'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSeatAssignment = {
  params: Joi.object().keys({
    seatAssignmentId: Joi.string().custom(objectId).required(),
  }),
};

const updateAttendance = {
  params: Joi.object().keys({
    seatAssignmentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    attendance_status: Joi.string().valid('pending', 'present', 'absent', 'late').required(),
    check_in_time: Joi.date(),
  }),
};

const deleteSeatAssignment = {
  params: Joi.object().keys({
    seatAssignmentId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createSeatAssignment,
  bulkCreateSeatAssignment,
  getSeatAssignments,
  getSeatAssignment,
  updateAttendance,
  deleteSeatAssignment,
};