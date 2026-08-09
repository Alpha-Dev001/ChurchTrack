import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './services/database.service';

const startServer = async () => {
  console.log('Bootstrapping ChurchTrack API server...');

  await connectDatabase();

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`ChurchTrack API Server running on http://localhost:${env.port}`);
    console.log('Ready to accept booking, hall, and admin requests.');
  });
  server.requestTimeout = 30_000;
  server.headersTimeout = 35_000;
  server.keepAliveTimeout = 5_000;

  const shutdown = async () => {
    await disconnectDatabase();
    server.close(() => {
      console.log('ChurchTrack API server shut down gracefully.');
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
