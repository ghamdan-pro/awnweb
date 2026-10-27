import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();

// Standard permissive CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Language');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount Unified API v1
app.use('/api/v1', apiRoutes);

// Root greeting
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 مرحباً بكم في واجهة برمجة تطبيقات عون يمن (Awn Yemen Unified Backend API)',
    health: '/api/v1/health',
    status: 'online',
  });
});

export default app;
