export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Language');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    service: 'Awn Yemen Unified Backend & Services',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase',
      connected: true,
      //  endpoint: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqpqierkeeewwydklvgg.supabase.co',
    },
  });
}
