const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const loginStudent = catchAsync(async (req, res) => {
  const result = await authService.loginStudent(req.body.email, req.body.password);
  res.json({ success: true, data: result });
});

const loginAdmin = catchAsync(async (req, res) => {
  const result = await authService.loginAdmin(req.body.email, req.body.password);
  res.json({ success: true, data: result });
});

const loginSupervisor = catchAsync(async (req, res) => {
  const result = await authService.loginSupervisor(req.body.email, req.body.password);
  res.json({ success: true, data: result });
});

const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user, role: req.role } });
});

module.exports = {
  loginStudent,
  loginAdmin,
  loginSupervisor,
  getMe,
};
