import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './services/database.service';

const startServer = async () => {
  console.log('Bootstrapping SalleHub API server...');

  await connectDatabase();

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`SalleHub API Server running on http://localhost:${env.port}`);
    console.log('Ready to accept booking, hall, and admin requests.');
  });

  const shutdown = async () => {
    await disconnectDatabase();
    server.close(() => {
      console.log('SalleHub API server shut down gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
};

void startServer();
