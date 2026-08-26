const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, [], false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  if (env.nodeEnv === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal server error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  if (env.nodeEnv === 'development') {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
