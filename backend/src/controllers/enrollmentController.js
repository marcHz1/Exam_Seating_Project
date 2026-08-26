const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const enrollmentService = require('../services/enrollmentService');

const createEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);
  res.status(201).json({ success: true, data: enrollment });
});

const getEnrollments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['student_id', 'subject_id', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await enrollmentService.queryEnrollments(filter, options);
  res.json({ success: true, data: result });
});

const getEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.enrollmentId);
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  res.json({ success: true, data: enrollment });
});

const updateEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentById(req.params.enrollmentId, req.body);
  res.json({ success: true, data: enrollment });
});

const deleteEnrollment = catchAsync(async (req, res) => {
  await enrollmentService.deleteEnrollmentById(req.params.enrollmentId);
  res.status(204).send();
});

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
