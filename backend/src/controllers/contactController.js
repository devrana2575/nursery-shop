const Message = require('../models/Message');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  await Message.create({ name, email, message });
  res.status(201).json({ message: 'Thanks for reaching out — we will reply within one business day.' });
});

const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ read: 1, createdAt: -1 }).limit(200);
  const unread = await Message.countDocuments({ read: false });
  res.json({ messages, unread });
});

const markMessageRead = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!message) throw new AppError('Message not found', 404);
  res.json({ message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw new AppError('Message not found', 404);
  res.json({ message: 'Message deleted' });
});

module.exports = { createMessage, listMessages, markMessageRead, deleteMessage };
