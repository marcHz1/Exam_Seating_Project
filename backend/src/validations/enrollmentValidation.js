const Joi = require('joi');
const { objectId } = require('./custom');

const createEnrollment = {
  body: Joi.object().keys({
    student_id: Joi.string().custom(objectId).required(),
    subject_id: Joi.string().custom(objectId).required(),
    is_retake: Joi.boolean(),
    status: Joi.string().valid('active', 'dropped', 'completed'),
  }),
};

const getEnrollments = {
  query: Joi.object().keys({
    student_id: Joi.string().custom(objectId),
    subject_id: Joi.string().custom(objectId),
    status: Joi.string().valid('active', 'dropped', 'completed'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId).required(),
  }),
};

const updateEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      is_retake: Joi.boolean(),
      status: Joi.string().valid('active', 'dropped', 'completed'),
    })
    .min(1),
};

const deleteEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
