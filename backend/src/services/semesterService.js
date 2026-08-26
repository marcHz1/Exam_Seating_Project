const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const ApiError = require('../utils/ApiError');

const createSemester = async (body) => {
  return Semester.create(body);
};

const querySemesters = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'start_date';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const semesters = await Semester.find(filter)
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Semester.countDocuments(filter);
  return { semesters, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSemesterById = async (id) => {
  return Semester.findById(id);
};

const updateSemesterById = async (id, body) => {
  const semester = await getSemesterById(id);
  if (!semester) throw ApiError.notFound('Semester not found');
  Object.assign(semester, body);
  await semester.save();
  return semester;
};

const deleteSemesterById = async (id) => {
  const semester = await getSemesterById(id);
  if (!semester) throw ApiError.notFound('Semester not found');
  
  // BLOCK: Cannot delete if subjects exist (would cascade too deep)
  const subjectCount = await Subject.countDocuments({ semester_id: id });
  if (subjectCount > 0) {
    throw ApiError.badRequest('Cannot delete semester with existing subjects. Delete subjects first.');
  }
  
  await Semester.deleteOne({ _id: id });
  return semester;
};

module.exports = {
  createSemester,
  querySemesters,
  getSemesterById,
  updateSemesterById,
  deleteSemesterById,
};