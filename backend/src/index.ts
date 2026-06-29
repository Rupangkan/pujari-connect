// Load env FIRST — controllers read process.env at import time and fail closed without it.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import pujaRoutes from './routes/puja.routes';
import pujariRoutes from './routes/pujari.routes';
import bookingRoutes from './routes/booking.routes';
import samagriRoutes from './routes/samagri.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

// Behind a reverse proxy in prod so rate-limit sees the real client IP.
if (IS_PROD) app.set('trust proxy', 1);

// ─── Security middleware ─────────────────────────────────────────────────────
app.use(helmet());

// Lock CORS to known origins in prod; permissive only in dev.
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin: IS_PROD ? (allowedOrigins.length ? allowedOrigins : false) : '*',
}));

app.use(express.json({ limit: '100kb' }));
app.use(morgan(IS_PROD ? 'combined' : 'dev'));

// Global + stricter auth rate limits.
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 60_000, max: 6, standardHeaders: true, legacyHeaders: false }));
app.use('/api/admin/login', rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true, legacyHeaders: false }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Pujari Connect API', version: '1.0.0' });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/pujas', pujaRoutes);
app.use('/api/pujaris', pujariRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/samagri', samagriRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ─── Admin Panel (static SPA) ─────────────────────────────────────────────────
app.use('/admin', express.static(path.join(process.cwd(), 'public', 'admin')));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Pujari Connect API running on http://localhost:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/health`);
});

export default app;
