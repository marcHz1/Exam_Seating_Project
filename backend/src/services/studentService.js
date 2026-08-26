const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const SeatAssignment = require('../models/SeatAssignment');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const createStudent = async (studentBody) => {
  if (await Student.findOne({ email: studentBody.email })) {
    throw ApiError.conflict('Email already taken');
  }
  if (await Student.findOne({ university_number: studentBody.university_number })) {
    throw ApiError.conflict('University number already taken');
  }
  
  if (studentBody.password && !studentBody.password_hash) {
    studentBody.password_hash = studentBody.password;
  }
  
  return Student.create(studentBody);
};

const queryStudents = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const students = await Student.find(filter)
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Student.countDocuments(filter);
  return { students, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getStudentById = async (id) => {
  return Student.findById(id);
};

const updateStudentById = async (studentId, updateBody) => {
  const student = await getStudentById(studentId);
  if (!student) throw ApiError.notFound('Student not found');
  if (updateBody.email && (await Student.findOne({ email: updateBody.email, _id: { $ne: studentId } }))) {
    throw ApiError.conflict('Email already taken');
  }
  Object.assign(student, updateBody);
  await student.save();
  return student;
};

const deleteStudentById = async (studentId) => {
  const student = await getStudentById(studentId);
  if (!student) throw ApiError.notFound('Student not found');
  
  // CASCADE: Delete all related records
  await Enrollment.deleteMany({ student_id: studentId });
  await SeatAssignment.deleteMany({ student_id: studentId });
  await Notification.deleteMany({ student_id: studentId });
  
  await Student.deleteOne({ _id: studentId });
  return student;
};

module.exports = {
  createStudent,
  queryStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};