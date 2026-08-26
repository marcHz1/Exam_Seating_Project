const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const adminService = require('../services/adminService');

const createAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  res.status(201).json({ success: true, data: admin });
});

const getAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['full_name', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await adminService.queryAdmins(filter, options);
  res.json({ success: true, data: result });
});

const getAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.params.adminId);
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
  res.json({ success: true, data: admin });
});

const updateAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.updateAdminById(req.params.adminId, req.body);
  res.json({ success: true, data: admin });
});

const deleteAdmin = catchAsync(async (req, res) => {
  await adminService.deleteAdminById(req.params.adminId);
  res.status(204).send();
});

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
