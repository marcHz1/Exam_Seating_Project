const Joi = require('joi');
const { objectId } = require('./custom');

const createExam = {
  body: Joi.object().keys({
    subject_id: Joi.string().custom(objectId).required(),
    exam_type_id: Joi.string().custom(objectId).required(),
    exam_date: Joi.date().required(),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled'),
    hall_ids: Joi.array().items(Joi.string().custom(objectId)).min(1),
    supervisor_ids: Joi.array().items(Joi.string().custom(objectId)).min(1),
    head_supervisors: Joi.array().items(
      Joi.object().keys({
        hall_id: Joi.string().custom(objectId).required(),
        supervisor_id: Joi.string().custom(objectId).required(),
      })
    ).min(1),
  }),
};

const getExams = {
  query: Joi.object().keys({
    subject_id: Joi.string().custom(objectId),
    exam_type_id: Joi.string().custom(objectId),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled'),
    exam_date: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExam = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
};

const updateExam = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      exam_date: Joi.date(),
      start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      status: Joi.string().valid('scheduled', 'ongoing', 'completed', 'cancelled'),
    })
    .min(1),
};

const deleteExam = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
};

const assignHalls = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    hall_ids: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
  }),
};

const autoAssignSeats = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    hall_ids: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const autoAssignSupervisors = {
  params: Joi.object().keys({
    examId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    supervisor_ids: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
    head_supervisors: Joi.array().items(
      Joi.object().keys({
        hall_id: Joi.string().custom(objectId).required(),
        supervisor_id: Joi.string().custom(objectId).required(),
      })
    ).min(1).required(),
  }),
};

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  assignHalls,
  autoAssignSeats,
  autoAssignSupervisors,
};