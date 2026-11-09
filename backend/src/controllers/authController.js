const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({ name, email, password });
  const token = signToken(user);

  res.status(201).json({ token, user: toPublicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

module.exports = { register, login, me, toPublicUser };
