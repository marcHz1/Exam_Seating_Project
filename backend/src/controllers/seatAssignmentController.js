const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const seatAssignmentService = require('../services/seatAssignmentService');
const notificationService = require('../services/notificationService');

const createSeatAssignment = catchAsync(async (req, res) => {
  const assignment = await seatAssignmentService.createSeatAssignment(req.body);
  // Notify student
  try {
    await notificationService.notifySeatAssignment(assignment._id);
  } catch (e) { /* silent fail for notification */ }
  res.status(201).json({ success: true, data: assignment });
});

const getSeatAssignments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['student_id', 'exam_id', 'attendance_status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await seatAssignmentService.querySeatAssignments(filter, options);
  res.json({ success: true, data: result });
});

// NEW: Force filter to only the logged-in student's assignments
const getMySeatAssignments = catchAsync(async (req, res) => {
  const filter = { student_id: req.user._id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await seatAssignmentService.querySeatAssignments(filter, options);
  res.json({ success: true, data: result });
});

const getSeatAssignment = catchAsync(async (req, res) => {
  const assignment = await seatAssignmentService.getSeatAssignmentById(req.params.seatAssignmentId);
  if (!assignment) return res.status(404).json({ success: false, message: 'Seat assignment not found' });
  res.json({ success: true, data: assignment });
});

const updateAttendance = catchAsync(async (req, res) => {
  const assignment = await seatAssignmentService.updateAttendance(req.params.seatAssignmentId, req.body);
  res.json({ success: true, data: assignment });
});

const deleteSeatAssignment = catchAsync(async (req, res) => {
  await seatAssignmentService.deleteSeatAssignmentById(req.params.seatAssignmentId);
  res.status(204).send();
});

module.exports = {
  createSeatAssignment,
  getSeatAssignments,
  getMySeatAssignments,
  getSeatAssignment,
  updateAttendance,
  deleteSeatAssignment,
};