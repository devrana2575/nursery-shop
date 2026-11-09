const mongoose = require('mongoose');

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

const orderItemSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String, required: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An order must contain at least one item',
      },
    },
    total: { type: Number, required: true, min: 0 },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
      minlength: [10, 'Delivery address is too short'],
      maxlength: [300, 'Delivery address is too long'],
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
module.exports.ORDER_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};
