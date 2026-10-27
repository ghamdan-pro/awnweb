import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './server/app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('⚡ Vite dev middleware integrated into unified server.');
    } catch (e) {
      console.warn('⚠️ Could not start Vite in middleware mode, serving API only or static files.');
    }
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const domainUrl = process.env.APP_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
    || `https://awnyemen.vercel.app`;
  const localUrl = `http://localhost:${PORT}`;

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🇾🇪 Awn Yemen Unified Server running on port ${PORT}`);
    console.log(`🔗 Local Web Application: ${localUrl}`);
    console.log(`📡 Local Backend REST API: ${localUrl}/api/v1`);
    console.log(`🚀 Production / Vercel Endpoint: ${domainUrl}/api/v1`);
    console.log(`🌐 Supabase Linked: ${process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL}`);
    console.log(`=======================================================`);
  });
}

startServer();
