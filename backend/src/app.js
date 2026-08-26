const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('mongo-sanitize');
const env = require('./config/env');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(apiLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Sanitize NoSQL queries
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);
app.get('/', (req, res) => {
  res.json({
    name: 'Exam Seating System API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/v1'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

const PORT = env.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.nodeEnv} mode`);
});

module.exports = app;
