import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // In-memory demo store for server-side API endpoints
  const demoBookingsServerStore: unknown[] = [];

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'India Trip Planner API',
      mode: 'demo',
      currency: 'INR (₹)',
    });
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({ bookings: demoBookingsServerStore });
  });

  app.post('/api/bookings', (req, res) => {
    const booking = req.body;
    if (!booking || !booking.bookingId) {
      res.status(400).json({ error: 'Invalid booking payload' });
      return;
    }
    demoBookingsServerStore.unshift(booking);
    res.status(201).json({
      message: 'Demo booking successful',
      bookingId: booking.bookingId,
      booking,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`India Trip Planner full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
