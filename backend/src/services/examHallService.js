const ExamHall = require('../models/ExamHall');
const SupervisorAssignment = require('../models/SupervisorAssignment');
const ApiError = require('../utils/ApiError');

const queryExamHalls = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const examHalls = await ExamHall.find(filter)
    .populate('exam_id', 'exam_date start_time end_time status')
    .populate('hall_id', 'hall_name building_id capacity')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await ExamHall.countDocuments(filter);
  return { examHalls, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getExamHallById = async (id) => {
  return ExamHall.findById(id).populate('exam_id hall_id');
};

const deleteExamHallById = async (id) => {
  const examHall = await getExamHallById(id);
  if (!examHall) throw ApiError.notFound('Exam hall assignment not found');
  
  // CASCADE: Delete supervisor assignments for this exam hall
  await SupervisorAssignment.deleteMany({ exam_hall_id: id });
  await ExamHall.deleteOne({ _id: id });
  return examHall;
};

module.exports = {
  queryExamHalls,
  getExamHallById,
  deleteExamHallById,
};