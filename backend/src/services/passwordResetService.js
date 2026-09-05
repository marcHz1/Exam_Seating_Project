const PasswordResetRequest = require('../models/PasswordResetRequest');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const ApiError = require('../utils/ApiError');

const getUserModel = (requesterType) => requesterType === 'student' ? Student : Supervisor;

const createRequest = async ({ requester_type, email, message }) => {
  const Model = getUserModel(requester_type);
  const user = await Model.findOne({ email: email.toLowerCase() });
  if (!user) throw ApiError.notFound('No account found with this email');

  const existing = await PasswordResetRequest.findOne({ requester_type, email: email.toLowerCase(), status: 'pending' });
  if (existing) throw ApiError.conflict('A password reset request is already pending');

  return PasswordResetRequest.create({ requester_type, email: email.toLowerCase(), message: message || '' });
};

const queryRequests = async (filter, options) => {
  const { limit = 10, page = 1 } = options;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const requests = await PasswordResetRequest.find(filter).sort('-createdAt').limit(parseInt(limit, 10)).skip(skip);
  const count = await PasswordResetRequest.countDocuments(filter);
  return { requests, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getRequest = async (id) => {
  const request = await PasswordResetRequest.findById(id);
  if (!request) throw ApiError.notFound('Password reset request not found');
  return request;
};

const approveRequest = async (id, newPassword, adminResponse) => {
  const request = await getRequest(id);
  if (request.status !== 'pending') throw ApiError.badRequest('Request is already ' + request.status);
  const Model = getUserModel(request.requester_type);
  const user = await Model.findOne({ email: request.email }).select('+password_hash');
  if (!user) throw ApiError.notFound('Request sender account not found');
  user.password_hash = newPassword;
  await user.save();
  request.status = 'approved';
  request.admin_response = adminResponse || '';
  request.resolved_at = new Date();
  await request.save();
  return request;
};

const declineRequest = async (id, adminResponse) => {
  const request = await getRequest(id);
  if (request.status !== 'pending') throw ApiError.badRequest('Request is already ' + request.status);
  request.status = 'declined';
  request.admin_response = adminResponse || '';
  request.resolved_at = new Date();
  await request.save();
  return request;
};

const deleteRequest = async (id) => {
  const request = await getRequest(id);
  await PasswordResetRequest.deleteOne({ _id: id });
  return request;
};

module.exports = { createRequest, queryRequests, approveRequest, declineRequest, deleteRequest };
