const express = require('express');
const { body, param } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  getStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Order = require('../models/Order');

const router = express.Router();

const createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Your cart is empty'),
  body('items.*.plantId').isMongoId().withMessage('Invalid plant in cart'),
  body('items.*.quantity').isInt({ min: 1, max: 99 }).withMessage('Invalid quantity').toInt(),
  body('address')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Please provide a delivery address (10-300 characters)'),
];

router.use(protect);

router.post('/', validate(createOrderRules), createOrder);
router.get('/mine', getMyOrders);
router.patch(
  '/:id/cancel',
  param('id').isMongoId().withMessage('Invalid order id'),
  validate([]),
  cancelMyOrder
);

router.get('/', adminOnly, getAllOrders);
router.get('/stats', adminOnly, getStats);
router.put(
  '/:id/status',
  adminOnly,
  param('id').isMongoId().withMessage('Invalid order id'),
  body('status').isIn(Order.ORDER_STATUSES).withMessage('Invalid order status'),
  validate([]),
  updateOrderStatus
);

module.exports = router;
