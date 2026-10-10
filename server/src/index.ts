import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { setupSocketServer } from './socket/socketServer.js';
import { voiceManager } from './participants/voiceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/session', (req, res) => {
  // Mock session creation
  const sessionId = Date.now().toString(36);
  res.json({ sessionId });
});

app.get('/api/report/:sessionId', (req, res) => {
  res.json({ message: 'Report placeholder' });
});

app.post('/api/ephemeral-token', (req, res) => {
  res.json({ token: 'mock-token-for-live-api' });
});

// Serve static frontend files in production
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Initialize socket server
setupSocketServer(httpServer, config.corsOrigin);

// Start server
async function start() {
  await voiceManager.initializeVoices();
  
  httpServer.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
}

start().catch(err => logger.error('Server failed to start:', err));
