const Joi = require('joi');
const { objectId } = require('./custom');

const createSubject = {
  body: Joi.object().keys({
    subject_code: Joi.string().uppercase().required(),
    subject_name: Joi.string().max(100).required(),
    credit_hours: Joi.number().integer().min(1).max(10).required(),
    level_year: Joi.number().integer().min(1).max(10).required(),
    is_mandatory: Joi.boolean().default(true),
    semester_id: Joi.string().custom(objectId).required(),
  }),
};

const getSubjects = {
  query: Joi.object().keys({
    semester_id: Joi.string().custom(objectId),
    level_year: Joi.number().integer().min(1).max(10),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(0),
    page: Joi.number().integer().min(0),
  }),
};

const getSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId).required(),
  }),
};

const updateSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      subject_code: Joi.string().uppercase(),
      subject_name: Joi.string().max(100),
      credit_hours: Joi.number().integer().min(1).max(10),
      level_year: Joi.number().integer().min(1).max(10),
      is_mandatory: Joi.boolean(),
      semester_id: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
