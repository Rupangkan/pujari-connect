import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import pujaRoutes from './routes/puja.routes';
import pujariRoutes from './routes/pujari.routes';
import bookingRoutes from './routes/booking.routes';
import samagriRoutes from './routes/samagri.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

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
