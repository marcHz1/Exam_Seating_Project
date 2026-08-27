const Joi = require('joi');
const { objectId } = require('./customValidation');

const createProposal = {
  body: Joi.object().keys({
    supervisor_assignment_id: Joi.string().custom(objectId).required(),
    reason: Joi.string().required().min(5).max(1000),
  }),
};

const approveProposal = {
  params: Joi.object().keys({
    proposalId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    replacement_supervisor_id: Joi.string().custom(objectId).required(),
    admin_response: Joi.string().max(1000).optional(),
  }),
};

const declineProposal = {
  params: Joi.object().keys({
    proposalId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    admin_response: Joi.string().max(1000).optional(),
  }),
};

module.exports = {
  createProposal,
  approveProposal,
  declineProposal,
};