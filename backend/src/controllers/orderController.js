const Order = require('../models/Order');
const Plant = require('../models/Plant');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const ORDER_TRANSITIONS = Order.ORDER_TRANSITIONS;

/**
 * Restores stock for every line item in an order. Only called when an order
 * transitions into the Cancelled state, so stock can never be restored twice.
 */
async function restoreStock(order) {
  await Promise.all(
    order.items.map((item) =>
      Plant.updateOne({ _id: item.plantId }, { $inc: { stock: item.quantity } })
    )
  );
}

const createOrder = asyncHandler(async (req, res) => {
  const { items, address } = req.body;

  const plantIds = items.map((item) => item.plantId);
  const plants = await Plant.find({ _id: { $in: plantIds } });
  const plantMap = new Map(plants.map((plant) => [plant._id.toString(), plant]));

  // Validate everything up-front so we do not touch stock unnecessarily.
  const orderItems = items.map((item) => {
    const plant = plantMap.get(item.plantId);
    if (!plant) throw new AppError('One of the plants in your cart no longer exists', 400);
    if (plant.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${plant.name}`, 400);
    }
    return {
      plantId: plant._id,
      name: plant.name,
      price: plant.price,
      quantity: item.quantity,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Atomically decrement stock. If any line fails (e.g. a concurrent order
  // took the last unit), roll back the lines we already decremented.
  const decremented = [];
  try {
    for (const item of orderItems) {
      const updated = await Plant.findOneAndUpdate(
        { _id: item.plantId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) throw new AppError(`Not enough stock for ${item.name}`, 400);
      decremented.push(item);
    }

    const order = await Order.create({
      userId: req.user._id,
      userName: req.user.name,
      items: orderItems,
      total,
      address,
    });

    res.status(201).json({ order });
  } catch (err) {
    await Promise.all(
      decremented.map((item) =>
        Plant.updateOne({ _id: item.plantId }, { $inc: { stock: item.quantity } })
      )
    );
    throw err;
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(500);
  res.json({ orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  const allowed = ORDER_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    throw new AppError(`Cannot change an order from ${order.status} to ${status}`, 400);
  }

  if (status === 'Cancelled') await restoreStock(order);

  order.status = status;
  await order.save();

  res.json({ order });
});

const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) throw new AppError('Order not found', 404);
  if (order.status !== 'Pending') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  await restoreStock(order);
  order.status = 'Cancelled';
  await order.save();

  res.json({ order });
});

const getStats = asyncHandler(async (req, res) => {
  const [totalPlants, lowStockPlants, orders, revenueAgg] = await Promise.all([
    Plant.countDocuments(),
    Plant.countDocuments({ stock: { $lte: 5 } }),
    Order.find().select('status total'),
    Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  const byStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    stats: {
      totalPlants,
      lowStockPlants,
      totalOrders: orders.length,
      pendingOrders: byStatus.Pending || 0,
      confirmedOrders: byStatus.Confirmed || 0,
      deliveredOrders: byStatus.Delivered || 0,
      cancelledOrders: byStatus.Cancelled || 0,
      revenue: revenueAgg[0]?.total || 0,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  getStats,
};
