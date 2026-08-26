const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Supervisor = require('../models/Supervisor');

const generateToken = (userId, secret, expiresIn = env.jwt.accessExpiration) => {
  return jwt.sign({ sub: userId.toString() }, secret, { expiresIn });
};

const loginStudent = async (email, password) => {
  const student = await Student.findOne({ email }).select('+password_hash');
  if (!student || !(await student.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  const token = generateToken(student._id, env.jwt.studentSecret);
  return { user: student.toJSON(), token };
};

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password_hash');
  if (!admin || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  const token = generateToken(admin._id, env.jwt.adminSecret);
  return { user: admin.toJSON(), token };
};

const loginSupervisor = async (email, password) => {
  const supervisor = await Supervisor.findOne({ email }).select('+password_hash');
  if (!supervisor || !(await supervisor.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  const token = generateToken(supervisor._id, env.jwt.supervisorSecret);
  return { user: supervisor.toJSON(), token };
};

module.exports = {
  loginStudent,
  loginAdmin,
  loginSupervisor,
  generateToken,
};
