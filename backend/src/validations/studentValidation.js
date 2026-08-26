const Joi = require('joi');
const { objectId } = require('./custom');

const createStudent = {
  body: Joi.object().keys({
    full_name: Joi.string().max(100).required(),
    university_number: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    current_level: Joi.number().integer().min(1).max(10).required(),
    phone: Joi.string().allow('', null),
  }),
};

const getStudents = {
  query: Joi.object().keys({
    full_name: Joi.string(),
    current_level: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStudent = {
  params: Joi.object().keys({
    studentId: Joi.string().custom(objectId).required(),
  }),
};

const updateStudent = {
  params: Joi.object().keys({
    studentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      full_name: Joi.string().max(100),
      email: Joi.string().email(),
      current_level: Joi.number().integer().min(1).max(10),
      phone: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteStudent = {
  params: Joi.object().keys({
    studentId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
