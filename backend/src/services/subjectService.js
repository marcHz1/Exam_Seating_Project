const Subject = require('../models/Subject');
const Enrollment = require('../models/Enrollment');
const Exam = require('../models/Exam');
const ExamHall = require('../models/ExamHall');
const SeatAssignment = require('../models/SeatAssignment');
const SupervisorAssignment = require('../models/SupervisorAssignment');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const createSubject = async (body) => {
  if (await Subject.findOne({ subject_code: body.subject_code })) {
    throw ApiError.conflict('Subject code already exists');
  }
  return Subject.create(body);
};

const querySubjects = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'subject_code';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const subjects = await Subject.find(filter)
    .populate('semester_id', 'name academic_year')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Subject.countDocuments(filter);
  return { subjects, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSubjectById = async (id) => {
  return Subject.findById(id).populate('semester_id');
};

const updateSubjectById = async (id, body) => {
  const subject = await getSubjectById(id);
  if (!subject) throw ApiError.notFound('Subject not found');
  if (body.subject_code && (await Subject.findOne({ subject_code: body.subject_code, _id: { $ne: id } }))) {
    throw ApiError.conflict('Subject code already exists');
  }
  Object.assign(subject, body);
  await subject.save();
  return subject;
};

const deleteSubjectById = async (id) => {
  const subject = await getSubjectById(id);
  if (!subject) throw ApiError.notFound('Subject not found');
  
  // CASCADE: Delete enrollments for this subject
  await Enrollment.deleteMany({ subject_id: id });
  
  // CASCADE: Delete all exams for this subject (and their related data)
  const exams = await Exam.find({ subject_id: id });
  for (const exam of exams) {
    const examId = exam._id;
    const examHalls = await ExamHall.find({ exam_id: examId });
    const examHallIds = examHalls.map(eh => eh._id);
    const seatAssignments = await SeatAssignment.find({ exam_id: examId });
    const seatAssignmentIds = seatAssignments.map(sa => sa._id);
    
    await Notification.deleteMany({ seat_assignment_id: { $in: seatAssignmentIds } });
    await SeatAssignment.deleteMany({ exam_id: examId });
    await SupervisorAssignment.deleteMany({ exam_hall_id: { $in: examHallIds } });
    await ExamHall.deleteMany({ exam_id: examId });
    await Exam.deleteOne({ _id: examId });
  }
  
  await Subject.deleteOne({ _id: id });
  return subject;
};

module.exports = {
  createSubject,
  querySubjects,
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
};