const Joi = require('joi');

const loginStudent = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const loginAdmin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const loginSupervisor = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const registerStudent = {
  body: Joi.object().keys({
    full_name: Joi.string().max(100).required(),
    university_number: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    current_level: Joi.number().integer().min(1).max(5).required(),
    phone: Joi.string().allow('', null),
  }),
};

module.exports = {
  loginStudent,
  loginAdmin,
  loginSupervisor,
  registerStudent,
};
