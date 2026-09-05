const Joi = require('joi');

const createRequest = {
  body: Joi.object().keys({
    requester_type: Joi.string().valid('student', 'supervisor').required(),
    email: Joi.string().email().required(),
    message: Joi.string().max(1000).allow(''),
  }),
};

const getRequests = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'declined'),
    limit: Joi.number().integer().min(0),
    page: Joi.number().integer().min(0),
  }),
};

const requestId = {
  params: Joi.object().keys({
    requestId: Joi.string().hex().length(24).required(),
  }),
};

const approveRequest = {
  params: requestId.params,
  body: Joi.object().keys({
    new_password: Joi.string().min(6).required(),
    admin_response: Joi.string().max(1000).allow(''),
  }),
};

module.exports = { createRequest, getRequests, requestId, approveRequest };
