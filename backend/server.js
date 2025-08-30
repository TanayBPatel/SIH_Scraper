const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const config = require('./config/config');

// Import routes
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();
const PORT = config.server.port;

// Connect to PostgreSQL
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SIH Data Scraper & Gemini API Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      problems: '/api/problems',
      stats: '/api/stats',
      gemini: '/api/gemini/query',
      analytics: '/api/analytics',
      export: '/api/export',
      scraping: '/api/scrape'
    },
    documentation: 'Check the README for detailed API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    message: error.message,
    ...(config.server.env === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.env}`);
  console.log(`🗄️  PostgreSQL: Connected`);
  console.log(`🤖 Gemini API: ${config.gemini.apiKey !== 'your_gemini_api_key_here' ? 'Configured' : 'Not configured'}`);
  console.log(`📁 Export directory: ${__dirname}/exports`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
