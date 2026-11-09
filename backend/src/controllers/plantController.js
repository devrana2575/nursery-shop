const Plant = require('../models/Plant');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex, pagination } = require('../utils/query');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 },
};

const listPlants = asyncHandler(async (req, res) => {
  const { search = '', category = '', featured, sort = 'newest' } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);

  const filter = {};
  if (search.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { category: pattern }];
  }
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;

  const [plants, total] = await Promise.all([
    Plant.find(filter)
      .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
      .skip((page - 1) * limit)
      .limit(limit),
    Plant.countDocuments(filter),
  ]);

  res.json({ plants, pagination: pagination(page, limit, total) });
});

const listFeatured = asyncHandler(async (req, res) => {
  const plants = await Plant.find({ featured: true }).sort({ createdAt: -1 }).limit(4);
  res.json({ plants });
});

const getPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) throw new AppError('Plant not found', 404);
  res.json({ plant });
});

const createPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.create(req.body);
  res.status(201).json({ plant });
});

const updatePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plant) throw new AppError('Plant not found', 404);
  res.json({ plant });
});

const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) throw new AppError('Plant not found', 404);
  res.json({ message: 'Plant deleted successfully' });
});

const listCategories = asyncHandler(async (req, res) => {
  res.json({ categories: Plant.PLANT_CATEGORIES });
});

module.exports = {
  listPlants,
  listFeatured,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  listCategories,
};
