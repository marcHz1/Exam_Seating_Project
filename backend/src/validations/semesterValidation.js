const Joi = require('joi');
const { objectId } = require('./custom');

const createSemester = {
  body: Joi.object().keys({
    name: Joi.string().max(50).required(),
    academic_year: Joi.string().max(20).required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
  }),
};

const getSemesters = {
  query: Joi.object().keys({
    academic_year: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSemester = {
  params: Joi.object().keys({
    semesterId: Joi.string().custom(objectId).required(),
  }),
};

const updateSemester = {
  params: Joi.object().keys({
    semesterId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().max(50),
      academic_year: Joi.string().max(20),
      start_date: Joi.date(),
      end_date: Joi.date(),
    })
    .min(1),
};

const deleteSemester = {
  params: Joi.object().keys({
    semesterId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createSemester,
  getSemesters,
  getSemester,
  updateSemester,
  deleteSemester,
};
