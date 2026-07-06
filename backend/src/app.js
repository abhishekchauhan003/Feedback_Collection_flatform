const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const qrRoutes = require('./routes/qr.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middleware/error.middleware');
const rateLimiter = require('./middleware/rateLimit.middleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => res.send('OK'));

app.use(errorHandler);

module.exports = app;