const mongoose = require('mongoose');

const PLANT_CATEGORIES = ['Indoor', 'Outdoor', 'Succulents', 'Herbs', 'Flowering'];

const careTipsSchema = new mongoose.Schema(
  {
    water: { type: String, trim: true, default: '' },
    sunlight: { type: String, trim: true, default: '' },
    fertilizer: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
      maxlength: [80, 'Plant name cannot exceed 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: PLANT_CATEGORIES, message: 'Invalid plant category' },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be a whole number',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    careTips: {
      type: careTipsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

plantSchema.index({ category: 1 });
plantSchema.index({ featured: 1 });
plantSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Plant', plantSchema);
module.exports.PLANT_CATEGORIES = PLANT_CATEGORIES;
