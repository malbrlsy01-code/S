const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { port, corsOrigin, nodeEnv } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const unitRoutes = require('./routes/unitRoutes');
const leadRoutes = require('./routes/leadRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const frontendDir = path.resolve(__dirname, '../../sana tawer');
const adminDir = path.resolve(__dirname, '../admin');

// Keep the security headers, but allow the existing website's inline scripts/styles.
app.use(helmet({ contentSecurityPolicy: false }));

// Works both when the frontend is served by this backend and when it is run
// separately with Live Server / `npx serve` during development.
const allowedOrigins = new Set([
  corsOrigin,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
].filter(Boolean));
app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigin === '*' || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (nodeEnv !== 'test') app.use(morgan('dev'));

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true
}));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'sana-tower-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/leads', leadRoutes);

// Admin dashboard and main website are served by the same Node server.
app.use('/admin', express.static(adminDir));
app.use(express.static(frontendDir));
app.get('/', (req, res) => res.sendFile(path.join(frontendDir, 'index.html')));

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Sana Tower website: http://localhost:${port}`);
      console.log(`Admin dashboard:    http://localhost:${port}/admin/`);
      console.log(`API health:         http://localhost:${port}/api/health`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
