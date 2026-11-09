const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/nursery')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ─── SCHEMAS ─────────────────────────────

const plantSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  description: { type: String },
  image:       { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  careTips: {
    water:      { type: String, default: '' },
    sunlight:   { type: String, default: '' },
    fertilizer: { type: String, default: '' }
  }
});

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'user' }
});

const orderSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  items: [
    {
      plantId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
      name:     String,
      price:    Number,
      quantity: Number,
    }
  ],
  total:   { type: Number, required: true },
  address: { type: String, required: true },
  status:  { type: String, default: 'Pending' },
}, { timestamps: true });

const Plant = mongoose.model('Plant', plantSchema);
const User  = mongoose.model('User',  userSchema);
const Order = mongoose.model('Order', orderSchema);

// ─── AUTH ─────────────────────────────────

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

// ─── PLANTS ──────────────────────────────

app.get('/api/plants', async (req, res) => {
  res.json(await Plant.find());
});

app.get('/api/plants/featured', async (req, res) => {
  res.json(await Plant.find({ featured: true }).limit(4));
});

app.get('/api/plants/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Not found' });
    res.json(plant);
  } catch { res.status(400).json({ message: 'Invalid ID' }); }
});

app.post('/api/plants', async (req, res) => {
  try {
    res.status(201).json(await Plant.create(req.body));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/plants/:id', async (req, res) => {
  try {
    const updated = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/plants/:id', async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ─── ORDERS ──────────────────────────────

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, userName, items, total, address } = req.body;
    for (const item of items) {
      const plant = await Plant.findById(item.plantId);
      if (!plant || plant.stock < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${item.name}` });
      plant.stock -= item.quantity;
      await plant.save();
    }
    const order = await Order.create({ userId, userName, items, total, address });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ─────────────────────────────────────────

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
