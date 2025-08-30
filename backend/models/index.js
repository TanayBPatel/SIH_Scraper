const { sequelize } = require('../config/database');
const ProblemStatement = require('./ProblemStatement');
const ScrapingSession = require('./ScrapingSession');

// Define associations if needed
// For now, these models are independent

// Export models
module.exports = {
  sequelize,
  ProblemStatement,
  ScrapingSession
};
