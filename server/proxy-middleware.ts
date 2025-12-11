import type { Express } from 'express';

export function setupApiProxy(app: Express) {
  // Proxy /api requests to the .NET backend on port 5001
  app.use('/api', async (req, res, next) => {
    const backendUrl = `http://localhost:5001${req.url}`;
    
    try {
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers as Record<string, string>,
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      next(error);
    }
  });
}
