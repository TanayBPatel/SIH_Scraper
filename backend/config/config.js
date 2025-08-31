require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'master',
    user: process.env.DB_USER || 'bhupendra',
    password: process.env.DB_PASSWORD || 'password'
  },
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'your_gemini_api_key_here',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  },
  scraping: {
    delay: parseInt(process.env.SCRAPING_DELAY) || 500,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};
