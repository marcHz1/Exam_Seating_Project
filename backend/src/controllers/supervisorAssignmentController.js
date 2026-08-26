const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const supervisorAssignmentService = require('../services/supervisorAssignmentService');

const createSupervisorAssignment = catchAsync(async (req, res) => {
  const assignment = await supervisorAssignmentService.createSupervisorAssignment(req.body);
  res.status(201).json({ success: true, data: assignment });
});

const getSupervisorAssignments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['exam_hall_id', 'supervisor_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await supervisorAssignmentService.querySupervisorAssignments(filter, options);
  res.json({ success: true, data: result });
});

// NEW: Force filter to only the logged-in supervisor's assignments
const getMySupervisorAssignments = catchAsync(async (req, res) => {
  const filter = { supervisor_id: req.user._id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await supervisorAssignmentService.querySupervisorAssignments(filter, options);
  res.json({ success: true, data: result });
});

const getSupervisorAssignment = catchAsync(async (req, res) => {
  const assignment = await supervisorAssignmentService.getSupervisorAssignmentById(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
  res.json({ success: true, data: assignment });
});

const updateSupervisorAssignment = catchAsync(async (req, res) => {
  const assignment = await supervisorAssignmentService.updateSupervisorAssignmentById(req.params.assignmentId, req.body);
  res.json({ success: true, data: assignment });
});

const deleteSupervisorAssignment = catchAsync(async (req, res) => {
  await supervisorAssignmentService.deleteSupervisorAssignmentById(req.params.assignmentId);
  res.status(204).send();
});

module.exports = {
  createSupervisorAssignment,
  getSupervisorAssignments,
  getMySupervisorAssignments,
  getSupervisorAssignment,
  updateSupervisorAssignment,
  deleteSupervisorAssignment,
};