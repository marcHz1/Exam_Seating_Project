const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const passwordResetService = require('../services/passwordResetService');

const createRequest = catchAsync(async (req, res) => {
  const request = await passwordResetService.createRequest(req.body);
  res.status(201).json({ success: true, data: request });
});

const getRequests = catchAsync(async (req, res) => {
  const result = await passwordResetService.queryRequests(pick(req.query, ['status']), pick(req.query, ['limit', 'page']));
  res.json({ success: true, data: result });
});

const approveRequest = catchAsync(async (req, res) => {
  const request = await passwordResetService.approveRequest(req.params.requestId, req.body.new_password, req.body.admin_response);
  res.json({ success: true, data: request });
});

const declineRequest = catchAsync(async (req, res) => {
  const request = await passwordResetService.declineRequest(req.params.requestId, req.body.admin_response);
  res.json({ success: true, data: request });
});

const deleteRequest = catchAsync(async (req, res) => {
  await passwordResetService.deleteRequest(req.params.requestId);
  res.status(204).send();
});

module.exports = { createRequest, getRequests, approveRequest, declineRequest, deleteRequest };
