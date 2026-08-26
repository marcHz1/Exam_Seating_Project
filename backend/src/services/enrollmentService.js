const Enrollment = require('../models/Enrollment');
const Subject = require('../models/Subject');
const ApiError = require('../utils/ApiError');

const createEnrollment = async (body) => {
  const existing = await Enrollment.findOne({ student_id: body.student_id, subject_id: body.subject_id });
  if (existing) throw ApiError.conflict('Student already enrolled in this subject');
  return Enrollment.create(body);
};

const queryEnrollments = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const enrollments = await Enrollment.find(filter)
    .populate('student_id', 'full_name university_number email')
    .populate('subject_id', 'subject_code subject_name')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Enrollment.countDocuments(filter);
  return { enrollments, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getEnrollmentById = async (id) => {
  return Enrollment.findById(id).populate('student_id subject_id');
};

const updateEnrollmentById = async (id, body) => {
  const enrollment = await getEnrollmentById(id);
  if (!enrollment) throw ApiError.notFound('Enrollment not found');
  Object.assign(enrollment, body);
  await enrollment.save();
  return enrollment;
};

const deleteEnrollmentById = async (id) => {
  const enrollment = await getEnrollmentById(id);
  if (!enrollment) throw ApiError.notFound('Enrollment not found');
  
  // No cascade needed — seat assignments are per exam, not per enrollment
  await Enrollment.deleteOne({ _id: id });
  return enrollment;
};

module.exports = {
  createEnrollment,
  queryEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
};