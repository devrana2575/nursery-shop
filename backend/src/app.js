const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoose = require('mongoose');

const env = require('./config/env');
const AppError = require('./utils/AppError');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiters');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new AppError('Not allowed by CORS', 403));
    },
  })
);
app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));

if (!env.isTest) {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: env.nodeEnv,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
