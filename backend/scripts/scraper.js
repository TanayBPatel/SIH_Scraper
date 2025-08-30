require('dotenv').config();
const SIHScraper = require('../services/scraper');
const connectDB = require('../config/database');

async function runScraper() {
  try {
    console.log('🚀 Starting SIH Data Scraper...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Initialize scraper
    const scraper = new SIHScraper();
    
    // Start scraping all years
    console.log('📊 Starting to scrape all SIH years...');
    const results = await scraper.scrapeAllYears();
    
    console.log('✅ Scraping completed!');
    console.log('📋 Results:', JSON.stringify(results, null, 2));
    
    // Summary
    const successful = results.filter(r => r.status === 'completed' || r.status === 'already_scraped');
    const failed = results.filter(r => r.status === 'failed');
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Successful: ${successful.length} years`);
    console.log(`❌ Failed: ${failed.length} years`);
    
    if (failed.length > 0) {
      console.log(`\n❌ Failed years:`, failed.map(f => f.year));
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runScraper();
}

module.exports = runScraper;
