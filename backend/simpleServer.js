const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import simple routes
const simpleApiRoutes = require('./routes/simpleApi');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

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

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev'));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Simple API routes (no database)
app.use('/api', simpleApiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Simple SIH Data Scraper Backend (No Database)',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      problems: '/api/problems',
      stats: '/api/stats',
      scraping: '/api/scrape',
      test: '/api/test-scraping'
    },
    features: [
      'Uses Cheerio for HTML parsing',
      'No database dependencies',
      'Real-time web scraping',
      'In-memory data processing',
      'Sample data generation for testing'
    ],
    documentation: 'This is a simplified version focused on web scraping with Cheerio'
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
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
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
  console.log(`🚀 Simple Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 No Database Required`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 Simple API endpoints available`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test-scraping`);
});
