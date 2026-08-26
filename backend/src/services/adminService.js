const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');

const createAdmin = async (body) => {
  if (await Admin.findOne({ email: body.email })) {
    throw ApiError.conflict('Email already taken');
  }
  
  // Map password to password_hash for the schema
  if (body.password && !body.password_hash) {
    body.password_hash = body.password;
  }
  
  return Admin.create(body);
};

const queryAdmins = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const admins = await Admin.find(filter)
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Admin.countDocuments(filter);
  return { admins, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const updateAdminById = async (id, body) => {
  const admin = await getAdminById(id);
  if (!admin) throw ApiError.notFound('Admin not found');
  if (body.email && (await Admin.findOne({ email: body.email, _id: { $ne: id } }))) {
    throw ApiError.conflict('Email already taken');
  }
  Object.assign(admin, body);
  await admin.save();
  return admin;
};

const deleteAdminById = async (id) => {
  const admin = await getAdminById(id);
  if (!admin) throw ApiError.notFound('Admin not found');
  await admin.deleteOne();
  return admin;
};

module.exports = {
  createAdmin,
  queryAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
