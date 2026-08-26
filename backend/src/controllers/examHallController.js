const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const examHallService = require('../services/examHallService');

const getExamHalls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['exam_id', 'hall_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await examHallService.queryExamHalls(filter, options);
  res.json({ success: true, data: result });
});

const getExamHall = catchAsync(async (req, res) => {
  const examHall = await examHallService.getExamHallById(req.params.examHallId);
  if (!examHall) return res.status(404).json({ success: false, message: 'Exam hall not found' });
  res.json({ success: true, data: examHall });
});

const deleteExamHall = catchAsync(async (req, res) => {
  await examHallService.deleteExamHallById(req.params.examHallId);
  res.status(204).send();
});

module.exports = {
  getExamHalls,
  getExamHall,
  deleteExamHall,
};
