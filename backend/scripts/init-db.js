const { connectDB, sequelize } = require('../config/database');
const ProblemStatement = require('../models/ProblemStatement');
const ScrapingSession = require('../models/ScrapingSession');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await connectDB();
    
    console.log('✅ Database connection successful');
    
    // Test model queries
    console.log('🧪 Testing model queries...');
    
    const problemCount = await ProblemStatement.count();
    console.log(`📊 Problem statements in database: ${problemCount}`);
    
    const sessionCount = await ScrapingSession.count();
    console.log(`📊 Scraping sessions in database: ${sessionCount}`);
    
    // Test creating a sample problem
    console.log('🧪 Testing problem creation...');
    const sampleProblem = await ProblemStatement.create({
      title: 'Test Problem Statement',
      description: 'This is a test problem statement to verify the database is working.',
      category: 'Test',
      year: 2025,
      edition: 'SIH2025',
      problemId: 'TEST_001',
      organizationName: 'Test Organization',
      organizationType: 'Test',
      organizationSector: 'Test',
      technology: ['Test Tech'],
      domain: ['Test Domain'],
      difficulty: 'Easy',
      expectedOutcome: 'Test outcome',
      constraints: ['Test constraint'],
      resources: ['Test resource'],
      tags: ['test', 'sample'],
      complexity: 1,
      estimatedEffort: '1 day'
    });
    
    console.log(`✅ Sample problem created with ID: ${sampleProblem.id}`);
    
    // Clean up test data
    await sampleProblem.destroy();
    console.log('🧹 Test data cleaned up');
    
    console.log('🎉 Database initialization completed successfully!');
    console.log('🚀 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
