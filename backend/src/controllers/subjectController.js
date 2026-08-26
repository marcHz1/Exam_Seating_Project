const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const subjectService = require('../services/subjectService');

const createSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json({ success: true, data: subject });
});

const getSubjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['semester_id', 'level_year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subjectService.querySubjects(filter, options);
  res.json({ success: true, data: result });
});

const getSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.subjectId);
  if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
  res.json({ success: true, data: subject });
});

const updateSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.updateSubjectById(req.params.subjectId, req.body);
  res.json({ success: true, data: subject });
});

const deleteSubject = catchAsync(async (req, res) => {
  await subjectService.deleteSubjectById(req.params.subjectId);
  res.status(204).send();
});

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
