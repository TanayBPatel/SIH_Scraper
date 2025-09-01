const SIHScraper = require('../services/scraper');
const { sequelize } = require('../config/database');

async function fullScrape() {
  try {
    console.log('🚀 Starting full scraping process...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Initialize scraper
    const scraper = new SIHScraper();
    console.log(`📋 Will scrape years: ${scraper.years.join(', ')}`);
    
    // Start scraping all years
    const results = await scraper.scrapeAllYears();
    
    console.log('\n📊 Scraping Results:');
    results.forEach(result => {
      console.log(`  ${result.year}: ${result.status} - ${result.count || 0} problems`);
    });
    
    // Get total count from database
    const { ProblemStatement } = require('../models');
    const totalProblems = await ProblemStatement.count();
    console.log(`\n🎉 Total problems in database: ${totalProblems}`);
    
    // Get count by year
    const yearStats = await sequelize.query(`
      SELECT year, COUNT(*) as count 
      FROM problem_statements 
      GROUP BY year 
      ORDER BY year DESC
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('\n📈 Problems by year:');
    yearStats.forEach(stat => {
      console.log(`  ${stat.year}: ${stat.count} problems`);
    });
    
    console.log('\n✅ Full scraping completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during full scraping:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
if (require.main === module) {
  fullScrape();
}

module.exports = fullScrape;
