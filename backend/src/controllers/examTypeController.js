const catchAsync = require('../utils/catchAsync');
const examTypeService = require('../services/examTypeService');

const createExamType = catchAsync(async (req, res) => {
  const examType = await examTypeService.createExamType(req.body);
  res.status(201).json({ success: true, data: examType });
});

const getExamTypes = catchAsync(async (req, res) => {
  const examTypes = await examTypeService.getAllExamTypes();
  res.json({ success: true, data: examTypes });
});

const getExamType = catchAsync(async (req, res) => {
  const examType = await examTypeService.getExamTypeById(req.params.examTypeId);
  if (!examType) return res.status(404).json({ success: false, message: 'Exam type not found' });
  res.json({ success: true, data: examType });
});

const updateExamType = catchAsync(async (req, res) => {
  const examType = await examTypeService.updateExamTypeById(req.params.examTypeId, req.body);
  res.json({ success: true, data: examType });
});

const deleteExamType = catchAsync(async (req, res) => {
  await examTypeService.deleteExamTypeById(req.params.examTypeId);
  res.status(204).send();
});

module.exports = {
  createExamType,
  getExamTypes,
  getExamType,
  updateExamType,
  deleteExamType,
};
