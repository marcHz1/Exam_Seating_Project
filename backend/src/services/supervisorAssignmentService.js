const SupervisorAssignment = require('../models/SupervisorAssignment');
const ApiError = require('../utils/ApiError');

const createSupervisorAssignment = async (body) => {
  const existing = await SupervisorAssignment.findOne({
    exam_hall_id: body.exam_hall_id,
    supervisor_id: body.supervisor_id,
  });
  if (existing) throw ApiError.conflict('Supervisor already assigned to this exam hall');
  return SupervisorAssignment.create(body);
};

const querySupervisorAssignments = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const assignments = await SupervisorAssignment.find(filter)
    .populate({
      path: 'exam_hall_id',
      populate: [
        { path: 'exam_id', populate: { path: 'subject_id', select: 'subject_name subject_code' } },
        { path: 'hall_id', populate: { path: 'building_id', select: 'building_name' } }
      ]
    })
    .populate('supervisor_id', 'full_name email phone')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await SupervisorAssignment.countDocuments(filter);
  return { assignments, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSupervisorAssignmentById = async (id) => {
  return SupervisorAssignment.findById(id)
    .populate('exam_hall_id')
    .populate('supervisor_id');
};

const updateSupervisorAssignmentById = async (id, body) => {
  const assignment = await getSupervisorAssignmentById(id);
  if (!assignment) throw ApiError.notFound('Assignment not found');
  Object.assign(assignment, body);
  await assignment.save();
  return assignment;
};

const deleteSupervisorAssignmentById = async (id) => {
  const assignment = await getSupervisorAssignmentById(id);
  if (!assignment) throw ApiError.notFound('Assignment not found');
  await assignment.deleteOne();
  return assignment;
};

module.exports = {
  createSupervisorAssignment,
  querySupervisorAssignments,
  getSupervisorAssignmentById,
  updateSupervisorAssignmentById,
  deleteSupervisorAssignmentById,
};