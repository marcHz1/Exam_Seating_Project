const Supervisor = require('../models/Supervisor');
const SupervisorAssignment = require('../models/SupervisorAssignment');
const ApiError = require('../utils/ApiError');

const createSupervisor = async (body) => {
  if (await Supervisor.findOne({ email: body.email })) {
    throw ApiError.conflict('Email already taken');
  }
  
  if (body.password && !body.password_hash) {
    body.password_hash = body.password;
  }
  
  return Supervisor.create(body);
};

const querySupervisors = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const supervisors = await Supervisor.find(filter)
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Supervisor.countDocuments(filter);
  return { supervisors, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getSupervisorById = async (id) => {
  return Supervisor.findById(id);
};

const updateSupervisorById = async (id, body) => {
  const supervisor = await getSupervisorById(id);
  if (!supervisor) throw ApiError.notFound('Supervisor not found');
  if (body.email && (await Supervisor.findOne({ email: body.email, _id: { $ne: id } }))) {
    throw ApiError.conflict('Email already taken');
  }
  Object.assign(supervisor, body);
  await supervisor.save();
  return supervisor;
};

const deleteSupervisorById = async (id) => {
  const supervisor = await getSupervisorById(id);
  if (!supervisor) throw ApiError.notFound('Supervisor not found');
  
  // CASCADE: Remove from all exam halls
  await SupervisorAssignment.deleteMany({ supervisor_id: id });
  
  await Supervisor.deleteOne({ _id: id });
  return supervisor;
};

module.exports = {
  createSupervisor,
  querySupervisors,
  getSupervisorById,
  updateSupervisorById,
  deleteSupervisorById,
};