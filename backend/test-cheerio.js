const SimpleSIHScraper = require('./services/simpleScraper');

async function testCheerioScraping() {
  console.log('🧪 Testing Cheerio-based SIH Scraper...\n');
  
  const scraper = new SimpleSIHScraper();
  
  try {
    // Test scraping a single year first
    console.log('📅 Testing single year scraping (2025)...');
    const singleYearResult = await scraper.scrapeYear(2025);
    
    console.log('✅ Single year result:', {
      year: singleYearResult.year,
      status: singleYearResult.status,
      count: singleYearResult.count,
      sampleProblem: singleYearResult.problems ? singleYearResult.problems[0] : null
    });
    
    if (singleYearResult.problems && singleYearResult.problems.length > 0) {
      console.log('\n📋 Sample problem data:');
      console.log(JSON.stringify(singleYearResult.problems[0], null, 2));
    }
    
    console.log('\n' + '='.repeat(50));
    
    // Test scraping multiple years (limited for testing)
    console.log('\n📅 Testing multiple years scraping (2024, 2023)...');
    scraper.years = [2024, 2023]; // Limit to 2 years for testing
    
    const multiYearResult = await scraper.scrapeAllYears();
    
    console.log('✅ Multi-year result:', {
      totalYears: multiYearResult.length,
      results: multiYearResult.map(r => ({
        year: r.year,
        status: r.status,
        count: r.count
      }))
    });
    
    // Test data filtering and processing
    console.log('\n🔍 Testing data processing...');
    const allProblems = multiYearResult.flatMap(result => result.problems || []);
    
    if (allProblems.length > 0) {
      // Test filtering by category
      const healthcareProblems = allProblems.filter(p => p.category === 'Healthcare');
      console.log(`🏥 Healthcare problems: ${healthcareProblems.length}`);
      
      // Test filtering by year
      const year2024Problems = allProblems.filter(p => p.year === 2024);
      console.log(`📅 2024 problems: ${year2024Problems.length}`);
      
      // Test search functionality
      const aiProblems = allProblems.filter(p => 
        p.title.toLowerCase().includes('ai') || 
        p.description.toLowerCase().includes('ai')
      );
      console.log(`🤖 AI-related problems: ${aiProblems.length}`);
      
      console.log('\n📊 Data quality check:');
      console.log(`- Total problems: ${allProblems.length}`);
      console.log(`- Problems with titles: ${allProblems.filter(p => p.title).length}`);
      console.log(`- Problems with descriptions: ${allProblems.filter(p => p.description).length}`);
      console.log(`- Problems with categories: ${allProblems.filter(p => p.category).length}`);
      console.log(`- Problems with organizations: ${allProblems.filter(p => p.organizationName).length}`);
    }
    
    console.log('\n🎉 Cheerio scraping test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testCheerioScraping();
}

module.exports = testCheerioScraping;
