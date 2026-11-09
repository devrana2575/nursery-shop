process.env.NODE_ENV = 'test';
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/nursery_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Plant = require('../src/models/Plant');
const Order = require('../src/models/Order');
const Message = require('../src/models/Message');

let userToken;
let adminToken;
let plantId;
let confirmedOrderId;
let cancelledOrderId;

async function cleanDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Plant.deleteMany({}),
    Order.deleteMany({}),
    Message.deleteMany({}),
  ]);
}

before(async () => {
  await connectDB(process.env.MONGODB_URI);
  await Promise.all([User.init(), Plant.init(), Order.init(), Message.init()]);
  await cleanDatabase();

  await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
  });
});

after(async () => {
  await cleanDatabase();
  await disconnectDB();
});

describe('Health & auth', () => {
  it('returns API health', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  it('rejects invalid registration payloads', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'short' });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Validation failed');
    assert.ok(res.body.errors.length >= 2);
  });

  it('registers a user and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ravi Patel', email: 'ravi@test.com', password: 'secret123' });
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'ravi@test.com');
    assert.equal(res.body.user.role, 'user');
    assert.equal(res.body.user.password, undefined);
    userToken = res.body.token;
  });

  it('prevents duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ravi Patel', email: 'ravi@test.com', password: 'secret123' });
    assert.equal(res.status, 409);
  });

  it('rejects wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@test.com', password: 'wrong-password' });
    assert.equal(res.status, 401);
  });

  it('logs in the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@test.com', password: 'secret123' });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    userToken = res.body.token;
  });

  it('logs in the admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.role, 'admin');
    adminToken = res.body.token;
  });

  it('returns the current user for a valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, 'ravi@test.com');
  });

  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
  });
});

describe('Plants', () => {
  it('forbids plant creation for regular users', async () => {
    const res = await request(app)
      .post('/api/plants')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hack', category: 'Indoor', price: 10, stock: 1 });
    assert.equal(res.status, 403);
  });

  it('lets an admin create a plant', async () => {
    const res = await request(app)
      .post('/api/plants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Monstera Deliciosa',
        category: 'Indoor',
        price: 549,
        stock: 5,
        description: 'A lovely split-leaf plant',
        featured: true,
        careTips: { water: 'Weekly', sunlight: 'Indirect', fertilizer: 'Monthly' },
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.plant.name, 'Monstera Deliciosa');
    plantId = res.body.plant._id;
  });

  it('rejects invalid plant data', async () => {
    const res = await request(app)
      .post('/api/plants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '', category: 'Nope', price: -5 });
    assert.equal(res.status, 400);
  });

  it('lists and searches plants with pagination metadata', async () => {
    const res = await request(app).get('/api/plants?search=monstera&limit=5');
    assert.equal(res.status, 200);
    assert.equal(res.body.plants.length, 1);
    assert.equal(res.body.pagination.total, 1);
    assert.equal(res.body.pagination.page, 1);
  });

  it('returns featured plants', async () => {
    const res = await request(app).get('/api/plants/featured');
    assert.equal(res.status, 200);
    assert.equal(res.body.plants.length, 1);
  });

  it('returns 404 for an unknown plant', async () => {
    const res = await request(app).get('/api/plants/64b7f9f9f9f9f9f9f9f9f9f9');
    assert.equal(res.status, 404);
  });
});

describe('Orders', () => {
  it('rejects orders without authentication', async () => {
    const res = await request(app).post('/api/orders').send({ items: [] });
    assert.equal(res.status, 401);
  });

  it('creates an order, computes the total server-side and decrements stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ plantId, quantity: 2, price: 1 }],
        total: 1,
        address: '12 Garden View Road, Anand, Gujarat',
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.order.total, 1098);
    assert.equal(res.body.order.items[0].price, 549);
    confirmedOrderId = res.body.order._id;

    const plant = await Plant.findById(plantId);
    assert.equal(plant.stock, 3);
  });

  it('rejects orders that exceed available stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ plantId, quantity: 99 }],
        address: '12 Garden View Road, Anand, Gujarat',
      });
    assert.equal(res.status, 400);
  });

  it('lists the current user orders', async () => {
    const res = await request(app)
      .get('/api/orders/mine')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.orders.length, 1);
  });

  it('forbids regular users from listing all orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 403);
  });

  it('lets an admin list all orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.orders.length, 1);
  });

  it('rejects invalid status transitions', async () => {
    const res = await request(app)
      .put(`/api/orders/${confirmedOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });
    assert.equal(res.status, 400);
  });

  it('lets an admin confirm an order', async () => {
    const res = await request(app)
      .put(`/api/orders/${confirmedOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Confirmed' });
    assert.equal(res.status, 200);
    assert.equal(res.body.order.status, 'Confirmed');
  });

  it('cancels a pending order and restores stock', async () => {
    const created = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ plantId, quantity: 1 }],
        address: '12 Garden View Road, Anand, Gujarat',
      });
    assert.equal(created.status, 201);
    cancelledOrderId = created.body.order._id;

    const res = await request(app)
      .patch(`/api/orders/${cancelledOrderId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.order.status, 'Cancelled');

    const plant = await Plant.findById(plantId);
    assert.equal(plant.stock, 3);
  });

  it('does not cancel an already confirmed order', async () => {
    const res = await request(app)
      .patch(`/api/orders/${confirmedOrderId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 400);
  });

  it('returns admin dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/orders/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.stats.totalOrders, 2);
    assert.equal(res.body.stats.confirmedOrders, 1);
    assert.equal(res.body.stats.cancelledOrders, 1);
    assert.equal(res.body.stats.totalPlants, 1);
  });
});

describe('Contact messages', () => {
  it('stores a contact message', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Asha',
      email: 'asha@test.com',
      message: 'Do you deliver to Ahmedabad as well?',
    });
    assert.equal(res.status, 201);
  });

  it('hides messages from regular users', async () => {
    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(res.status, 403);
  });

  it('lets an admin read and mark messages as read', async () => {
    const list = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(list.status, 200);
    assert.equal(list.body.messages.length, 1);
    assert.equal(list.body.unread, 1);

    const updated = await request(app)
      .patch(`/api/contact/${list.body.messages[0]._id}/read`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(updated.status, 200);
    assert.equal(updated.body.message.read, true);
  });
});

describe('Fallbacks', () => {
  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    assert.equal(res.status, 404);
    assert.match(res.body.message, /Route not found/);
  });
});
