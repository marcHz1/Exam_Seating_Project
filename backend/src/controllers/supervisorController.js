const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const supervisorService = require('../services/supervisorService');

const createSupervisor = catchAsync(async (req, res) => {
  const supervisor = await supervisorService.createSupervisor(req.body);
  res.status(201).json({ success: true, data: supervisor });
});

const getSupervisors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['full_name', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await supervisorService.querySupervisors(filter, options);
  res.json({ success: true, data: result });
});

const getSupervisor = catchAsync(async (req, res) => {
  const supervisor = await supervisorService.getSupervisorById(req.params.supervisorId);
  if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor not found' });
  res.json({ success: true, data: supervisor });
});

const updateSupervisor = catchAsync(async (req, res) => {
  const supervisor = await supervisorService.updateSupervisorById(req.params.supervisorId, pick(req.body, ['full_name', 'phone']));
  res.json({ success: true, data: supervisor });
});

const deleteSupervisor = catchAsync(async (req, res) => {
  await supervisorService.deleteSupervisorById(req.params.supervisorId);
  res.status(204).send();
});

module.exports = {
  createSupervisor,
  getSupervisors,
  getSupervisor,
  updateSupervisor,
  deleteSupervisor,
};
