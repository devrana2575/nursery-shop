const env = require('../config/env');
const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  // Mongoose: invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  // Mongoose: schema validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // MongoDB: duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    message = `A record with that ${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  if (statusCode >= 500 && env.nodeEnv !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
