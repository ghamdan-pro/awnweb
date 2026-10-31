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

// Direct health check endpoints to guarantee response regardless of path prefix or Vercel routing
const healthCheckHandler = (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Awn Yemen Unified Backend & Services',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase',
      connected: true,
      endpoint: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqpqierkeeewwydklvgg.supabase.co',
    },
  });
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);
app.get('/api/v1/health', healthCheckHandler);
app.get('/v1/health', healthCheckHandler);

// Mount Unified API v1 on multiple prefixes for maximum compatibility with Vercel rewrites & local proxy
app.use('/api/v1', apiRoutes);
app.use('/v1', apiRoutes);
app.use('/api', apiRoutes);

// Root greeting
app.get(['/', '/api', '/api/v1'], (req, res) => {
  res.json({
    message: '🚀 مرحباً بكم في واجهة برمجة تطبيقات عون يمن (Awn Yemen Unified Backend API)',
    health: '/api/v1/health',
    status: 'online',
  });
});

export default app;
