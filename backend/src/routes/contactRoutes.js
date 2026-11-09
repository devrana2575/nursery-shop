const express = require('express');
const { body, param } = require('express-validator');
const {
  createMessage,
  listMessages,
  markMessageRead,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const messageRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be 10-1000 characters'),
];

router.post('/', authLimiter, validate(messageRules), createMessage);

router.get('/', protect, adminOnly, listMessages);
router.patch(
  '/:id/read',
  protect,
  adminOnly,
  param('id').isMongoId().withMessage('Invalid message id'),
  validate([]),
  markMessageRead
);
router.delete(
  '/:id',
  protect,
  adminOnly,
  param('id').isMongoId().withMessage('Invalid message id'),
  validate([]),
  deleteMessage
);

module.exports = router;
