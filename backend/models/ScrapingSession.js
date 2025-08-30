const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ScrapingSession = sequelize.define('ScrapingSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  edition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalProblems: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  successCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  errorCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  errors: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  lastScrapedUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'scraping_sessions',
  timestamps: true,
  indexes: [
    {
      fields: ['status', 'year']
    }
  ]
});

// Instance methods
ScrapingSession.prototype.needsScraping = function() {
  return this.status !== 'completed' || 
         !this.completedAt || 
         (Date.now() - this.completedAt.getTime()) > (7 * 24 * 60 * 60 * 1000); // 7 days
};

ScrapingSession.prototype.markCompleted = async function(totalProblems, successCount) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.totalProblems = totalProblems;
  this.successCount = successCount;
  return await this.save();
};

module.exports = ScrapingSession;
