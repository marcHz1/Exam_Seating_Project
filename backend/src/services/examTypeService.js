const ExamType = require('../models/ExamType');
const Exam = require('../models/Exam');
const ApiError = require('../utils/ApiError');

const createExamType = async (body) => {
  if (await ExamType.findOne({ type_name: body.type_name })) {
    throw ApiError.conflict('Exam type already exists');
  }
  return ExamType.create(body);
};

const getAllExamTypes = async () => {
  return ExamType.find();
};

const getExamTypeById = async (id) => {
  return ExamType.findById(id);
};

const updateExamTypeById = async (id, body) => {
  const examType = await getExamTypeById(id);
  if (!examType) throw ApiError.notFound('Exam type not found');
  Object.assign(examType, body);
  await examType.save();
  return examType;
};

const deleteExamTypeById = async (id) => {
  const examType = await getExamTypeById(id);
  if (!examType) throw ApiError.notFound('Exam type not found');
  
  // BLOCK: Cannot delete if exams use this type
  const examCount = await Exam.countDocuments({ exam_type_id: id });
  if (examCount > 0) {
    throw ApiError.badRequest('Cannot delete exam type with existing exams. Delete exams first.');
  }
  
  await ExamType.deleteOne({ _id: id });
  return examType;
};

module.exports = {
  createExamType,
  getAllExamTypes,
  getExamTypeById,
  updateExamTypeById,
  deleteExamTypeById,
};