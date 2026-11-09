/* eslint-disable no-console */
const env = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const User = require('./src/models/User');
const Plant = require('./src/models/Plant');

const ADMIN = {
  name: 'Admin',
  email: 'admin@nursery.com',
  password: 'admin123',
  role: 'admin',
};

const DEMO_USER = {
  name: 'Demo User',
  email: 'user@nursery.com',
  password: 'user1234',
  role: 'user',
};

const plants = [
  {
    name: 'Monstera',
    category: 'Indoor',
    price: 549,
    stock: 15,
    featured: true,
    description: 'Iconic split-leaf plant, perfect for living rooms.',
    image:
      'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Once a week',
      sunlight: '4-5 hours indirect',
      fertilizer: 'Once a month',
    },
  },
  {
    name: 'Snake Plant',
    category: 'Indoor',
    price: 249,
    stock: 30,
    featured: true,
    description: 'Nearly indestructible. Great for beginners.',
    image:
      'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Every 2-3 weeks',
      sunlight: 'Low to bright indirect',
      fertilizer: 'Every 2 months',
    },
  },
  {
    name: 'Aloe Vera',
    category: 'Succulents',
    price: 199,
    stock: 25,
    featured: false,
    description: 'Healing plant. Great on windowsills.',
    image:
      'https://images.pexels.com/photos/1459495/pexels-photo-1459495.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Every 3 weeks',
      sunlight: '6+ hours direct',
      fertilizer: 'Twice a year',
    },
  },
  {
    name: 'Rose Bush',
    category: 'Flowering',
    price: 399,
    stock: 10,
    featured: true,
    description: 'Classic red roses for your garden.',
    image:
      'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Daily in summer',
      sunlight: '6+ hours direct',
      fertilizer: 'Every 2 weeks',
    },
  },
  {
    name: 'Tulsi (Holy Basil)',
    category: 'Herbs',
    price: 79,
    stock: 50,
    featured: false,
    description: 'Sacred herb with medicinal value. Common in Indian homes.',
    image:
      'https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Daily',
      sunlight: '5-6 hours direct',
      fertilizer: 'Once a month',
    },
  },
  {
    name: 'Bougainvillea',
    category: 'Outdoor',
    price: 329,
    stock: 20,
    featured: true,
    description: 'Vibrant pink flowers for fences and gates.',
    image:
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: '2-3 times a week',
      sunlight: '5+ hours direct',
      fertilizer: 'Every 3 weeks',
    },
  },
  {
    name: 'Peace Lily',
    category: 'Indoor',
    price: 349,
    stock: 12,
    featured: false,
    description: 'White flowering plant. Grows well in low light.',
    image:
      'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Once a week',
      sunlight: 'Low to medium indirect',
      fertilizer: 'Every 6 weeks',
    },
  },
  {
    name: 'Marigold',
    category: 'Flowering',
    price: 49,
    stock: 60,
    featured: false,
    description: 'Bright flowers. Also acts as a natural pest repellent.',
    image:
      'https://images.pexels.com/photos/59992/pexels-photo-59992.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    careTips: {
      water: 'Every 2 days',
      sunlight: '6+ hours direct',
      fertilizer: 'Once a month',
    },
  },
];

async function upsertUser(data) {
  let user = await User.findOne({ email: data.email });
  if (!user) {
    user = new User(data);
  } else {
    user.name = data.name;
    user.role = data.role;
    user.password = data.password;
  }
  await user.save();
  return user;
}

async function seed() {
  await connectDB(env.mongoUri);
  console.log('Connected to MongoDB');

  await upsertUser(ADMIN);
  console.log(`Admin ready        →  ${ADMIN.email} / ${ADMIN.password}`);

  await upsertUser(DEMO_USER);
  console.log(`Demo user ready    →  ${DEMO_USER.email} / ${DEMO_USER.password}`);

  await Plant.deleteMany({});
  await Plant.insertMany(plants);
  console.log(`${plants.length} plants seeded`);

  await disconnectDB();
  console.log('Done.');
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
