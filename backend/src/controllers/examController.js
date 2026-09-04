const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const examService = require('../services/examService');
const Enrollment = require('../models/Enrollment');

const createExam = catchAsync(async (req, res) => {
  const exam = await examService.createExam(req.body, req.user._id);
  res.status(201).json({ success: true, data: exam });
});

const getExams = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['subject_id', 'exam_type_id', 'status', 'exam_date']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await examService.queryExams(filter, options);
  res.json({ success: true, data: result });
});

// NEW: Student only sees exams for subjects they are enrolled in
const getMyExams = catchAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ student_id: req.user._id, status: 'active' });
  const subjectIds = enrollments.filter(e => e.subject_id).map(e => e.subject_id.toString());
  
  if (subjectIds.length === 0) {
    return res.json({ success: true, data: { exams: [], totalPages: 0, currentPage: 1, total: 0 } });
  }
  
  const result = await examService.queryExams({ subject_id: { $in: subjectIds } }, { limit: 100, page: 1 });
  res.json({ success: true, data: result });
});

const getExam = catchAsync(async (req, res) => {
  const exam = await examService.getExamById(req.params.examId);
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
  res.json({ success: true, data: exam });
});

const updateExam = catchAsync(async (req, res) => {
  const exam = await examService.updateExamById(req.params.examId, req.body);
  res.json({ success: true, data: exam });
});

const deleteExam = catchAsync(async (req, res) => {
  await examService.deleteExamById(req.params.examId);
  res.status(204).send();
});

const assignHalls = catchAsync(async (req, res) => {
  const result = await examService.assignHallsToExam(req.params.examId, req.body.hall_ids);
  res.json({ success: true, data: result });
});

const autoAssignSeats = catchAsync(async (req, res) => {
  const result = await examService.autoAssignSeats(req.params.examId, req.body.hall_ids);
  res.json({ success: true, data: result });
});

const autoAssignSupervisors = catchAsync(async (req, res) => {
  const result = await examService.autoAssignSupervisors(
    req.params.examId,
    req.body.supervisor_ids,
    req.body.head_supervisors
  );
  res.json({ success: true, data: result });
});

const getExamDetails = catchAsync(async (req, res) => {
  const result = await examService.getExamDetails(req.params.examId);
  res.json({ success: true, data: result });
});

module.exports = {
  createExam,
  getExams,
  getMyExams,
  getExam,
  updateExam,
  deleteExam,
  assignHalls,
  autoAssignSeats,
  autoAssignSupervisors,
  getExamDetails
};