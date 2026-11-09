const app = require('./src/app');
const env = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');

let server;

async function start() {
  await connectDB(env.mongoUri);
  console.log(`MongoDB connected (${env.nodeEnv})`);

  server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDB();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
