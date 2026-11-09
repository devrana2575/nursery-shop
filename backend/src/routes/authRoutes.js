const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 60 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6, max: 72 })
    .withMessage('Password must be 6-72 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain a letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.get('/me', protect, me);

module.exports = router;
