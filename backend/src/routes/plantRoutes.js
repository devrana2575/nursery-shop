const express = require('express');
const { body, param } = require('express-validator');
const {
  listPlants,
  listFeatured,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  listCategories,
} = require('../controllers/plantController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Plant = require('../models/Plant');

const router = express.Router();

const plantRules = [
  body('name').trim().notEmpty().withMessage('Plant name is required').isLength({ max: 80 }),
  body('category')
    .isIn(Plant.PLANT_CATEGORIES)
    .withMessage(`Category must be one of: ${Plant.PLANT_CATEGORIES.join(', ')}`),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number').toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a whole number').toInt(),
  body('description').optional().isLength({ max: 500 }).withMessage('Description is too long'),
  body('image').optional().isString().withMessage('Image must be a URL string'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false').toBoolean(),
  body('careTips.water').optional().isLength({ max: 120 }),
  body('careTips.sunlight').optional().isLength({ max: 120 }),
  body('careTips.fertilizer').optional().isLength({ max: 120 }),
];

const updatePlantRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 80 }),
  body('category').optional().isIn(Plant.PLANT_CATEGORIES),
  body('price').optional().isFloat({ min: 0 }).toFloat(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
  body('description').optional().isLength({ max: 500 }),
  body('image').optional().isString(),
  body('featured').optional().isBoolean().toBoolean(),
  body('careTips.water').optional().isLength({ max: 120 }),
  body('careTips.sunlight').optional().isLength({ max: 120 }),
  body('careTips.fertilizer').optional().isLength({ max: 120 }),
];

router.get('/', listPlants);
router.get('/featured', listFeatured);
router.get('/categories', listCategories);
router.get('/:id', param('id').isMongoId().withMessage('Invalid plant id'), validate([]), getPlant);

router.post('/', protect, adminOnly, validate(plantRules), createPlant);
router.put(
  '/:id',
  protect,
  adminOnly,
  param('id').isMongoId().withMessage('Invalid plant id'),
  validate(updatePlantRules),
  updatePlant
);
router.delete(
  '/:id',
  protect,
  adminOnly,
  param('id').isMongoId().withMessage('Invalid plant id'),
  validate([]),
  deletePlant
);

module.exports = router;
