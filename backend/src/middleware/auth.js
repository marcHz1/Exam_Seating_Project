const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Supervisor = require('../models/Supervisor');

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const authStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, env.jwt.studentSecret);
    const student = await Student.findById(decoded.sub || decoded._id);
    if (!student) throw ApiError.unauthorized('Student not found');
    req.user = student;
    req.role = 'student';
    next();
  } catch (err) {
    next(ApiError.unauthorized(err.message || 'Invalid token'));
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, env.jwt.adminSecret);
    const admin = await Admin.findById(decoded.sub || decoded._id);
    if (!admin) throw ApiError.unauthorized('Admin not found');
    req.user = admin;
    req.role = 'admin';
    next();
  } catch (err) {
    next(ApiError.unauthorized(err.message || 'Invalid token'));
  }
};

const authSupervisor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, env.jwt.supervisorSecret);
    const supervisor = await Supervisor.findById(decoded.sub || decoded._id);
    if (!supervisor) throw ApiError.unauthorized('Supervisor not found');
    req.user = supervisor;
    req.role = 'supervisor';
    next();
  } catch (err) {
    next(ApiError.unauthorized(err.message || 'Invalid token'));
  }
};

// NEW: Accept any valid token (Student, Admin, or Supervisor)
const authAny = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }
    const token = authHeader.split(' ')[1];

    // Try each secret in order
    let decoded, user, role;
    const secrets = [
      { secret: env.jwt.studentSecret, model: Student, role: 'student' },
      { secret: env.jwt.adminSecret, model: Admin, role: 'admin' },
      { secret: env.jwt.supervisorSecret, model: Supervisor, role: 'supervisor' },
    ];

    for (const { secret, model, role: r } of secrets) {
      try {
        decoded = verifyToken(token, secret);
        user = await model.findById(decoded.sub || decoded._id);
        if (user) {
          role = r;
          break;
        }
      } catch {
        // Try next secret
        continue;
      }
    }

    if (!user) throw ApiError.unauthorized('Invalid token');
    req.user = user;
    req.role = role;
    next();
  } catch (err) {
    next(ApiError.unauthorized(err.message || 'Invalid token'));
  }
};

module.exports = {
  authStudent,
  authAdmin,
  authSupervisor,
  authAny,
};