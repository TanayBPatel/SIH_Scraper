const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProblemStatement = sequelize.define('ProblemStatement', {
  // Basic Information
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    index: true
  },
  
  // SIH Specific Information
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    index: true
  },
  edition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  problemId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  // Organization Details
  organizationName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organizationType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organizationSector: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Technical Details
  technology: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  domain: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium'
  },
  
  // Additional Information
  expectedOutcome: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  constraints: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  resources: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  
  // Metadata
  scrapedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  // Analysis Fields (for future use)
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  complexity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estimatedEffort: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'problem_statements',
  timestamps: true,
  indexes: [
    {
      fields: ['year', 'category']
    },
    {
      fields: ['title']
    },
    {
      fields: ['organizationName', 'year']
    }
  ]
});

// Instance method to get full text
ProblemStatement.prototype.getFullText = function() {
  return `${this.title}\n${this.description}\nCategory: ${this.category}\nOrganization: ${this.organizationName || 'N/A'}\nYear: ${this.year}`;
};

module.exports = ProblemStatement;
