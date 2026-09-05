const Joi = require('joi');
const { objectId } = require('./custom');

const createHall = {
  body: Joi.object().keys({
    building_id: Joi.string().custom(objectId).required(),
    hall_name: Joi.string().max(100).required(),
    capacity: Joi.number().integer().min(1).required(),
    rows_count: Joi.number().integer().min(1).required(),
    columns_count: Joi.number().integer().min(1).required(),
  }),
};

const getHalls = {
  query: Joi.object().keys({
    building_id: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(0),
    page: Joi.number().integer().min(0),
  }),
};

const getHall = {
  params: Joi.object().keys({
    hallId: Joi.string().custom(objectId).required(),
  }),
};

const updateHall = {
  params: Joi.object().keys({
    hallId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      hall_name: Joi.string().max(100),
      capacity: Joi.number().integer().min(1),
    })
    .min(1),
};

const deleteHall = {
  params: Joi.object().keys({
    hallId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createHall,
  getHalls,
  getHall,
  updateHall,
  deleteHall,
};
