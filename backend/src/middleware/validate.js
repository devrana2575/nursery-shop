const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs the express-validator chain and returns a 400 with a flat list of
 * field errors when validation fails.
 */
function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const result = validationResult(req);
      if (result.isEmpty()) return next();

      const errors = result.array().map(({ path, msg }) => ({ field: path, message: msg }));
      return next(new AppError('Validation failed', 400, errors));
    },
  ];
}

module.exports = validate;
