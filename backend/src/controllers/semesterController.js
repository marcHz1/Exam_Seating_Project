const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const semesterService = require('../services/semesterService');

const createSemester = catchAsync(async (req, res) => {
  const semester = await semesterService.createSemester(req.body);
  res.status(201).json({ success: true, data: semester });
});

const getSemesters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['academic_year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await semesterService.querySemesters(filter, options);
  res.json({ success: true, data: result });
});

const getSemester = catchAsync(async (req, res) => {
  const semester = await semesterService.getSemesterById(req.params.semesterId);
  if (!semester) return res.status(404).json({ success: false, message: 'Semester not found' });
  res.json({ success: true, data: semester });
});

const updateSemester = catchAsync(async (req, res) => {
  const semester = await semesterService.updateSemesterById(req.params.semesterId, req.body);
  res.json({ success: true, data: semester });
});

const deleteSemester = catchAsync(async (req, res) => {
  await semesterService.deleteSemesterById(req.params.semesterId);
  res.status(204).send();
});

module.exports = {
  createSemester,
  getSemesters,
  getSemester,
  updateSemester,
  deleteSemester,
};
