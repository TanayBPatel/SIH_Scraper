const { sequelize } = require('../config/database');
const ProblemStatement = require('../models/ProblemStatement');
const ScrapingSession = require('../models/ScrapingSession');
const SimpleSIHScraper = require('../services/simpleScraper');

async function resetDatabase() {
  try {
    console.log('🗑️  Starting database reset...');
    
    // Delete existing records instead of truncating tables
    await ProblemStatement.destroy({ where: {} });
    await ScrapingSession.destroy({ where: {} });
    console.log('✅ Existing records deleted');
    
    // Initialize scraper
    const scraper = new SimpleSIHScraper();
    
    console.log('🌐 Starting fresh data scraping...');
    
    // Scrape all years and store in database
    const results = await scraper.scrapeAllYears();
    
    let totalProblems = 0;
    const savedProblems = [];
    
    for (const result of results) {
      if (result.status === 'completed' && result.problems) {
        console.log(`📅 Processing ${result.problems.length} problems for year ${result.year}...`);
        
        for (const problem of result.problems) {
          try {
            // Create new problem statement in database
            const newProblem = await ProblemStatement.create({
              title: problem.title,
              description: problem.description,
              category: problem.category,
              year: problem.year,
              edition: problem.edition,
              problemId: problem.problemId,
              organizationName: problem.organizationName,
              organizationType: problem.organizationType,
              organizationSector: problem.organizationSector,
              technology: problem.technology || [],
              domain: problem.domain || [],
              difficulty: problem.difficulty,
              expectedOutcome: problem.expectedOutcome,
              constraints: problem.constraints || [],
              resources: problem.resources || [],
              tags: problem.tags || [],
              complexity: problem.complexity,
              estimatedEffort: problem.estimatedEffort,
              scrapedAt: new Date(),
              lastUpdated: new Date()
            });
            
            savedProblems.push(newProblem);
            totalProblems++;
            
          } catch (error) {
            console.error(`❌ Error saving problem:`, error.message);
            continue;
          }
        }
        
        // Create scraping session record
        await ScrapingSession.create({
          year: result.year,
          edition: `SIH${result.year}`,
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          totalProblems: result.problems.length,
          savedProblems: result.problems.length,
          errors: []
        });
        
        console.log(`✅ Year ${result.year}: ${result.problems.length} problems saved`);
      } else {
        console.log(`⚠️  Year ${result.year}: ${result.status} - ${result.error || 'No problems found'}`);
      }
    }
    
    console.log(`\n🎉 Database reset and population completed!`);
    console.log(`📊 Total problems saved: ${totalProblems}`);
    console.log(`📁 Years processed: ${results.length}`);
    
    // Verify data in database
    const dbCount = await ProblemStatement.count();
    console.log(`🔍 Database verification: ${dbCount} problems found`);
    
    if (dbCount === totalProblems) {
      console.log('✅ Database verification successful!');
    } else {
      console.log('⚠️  Database verification mismatch!');
    }
    
    await sequelize.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the reset if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
