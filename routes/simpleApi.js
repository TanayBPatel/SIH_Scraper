const express = require('express');
const router = express.Router();
const SimpleSIHScraper = require('../services/simpleScraper');

// Initialize simple scraper
const scraper = new SimpleSIHScraper();

// Middleware for rate limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(apiLimiter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Simple SIH Data API (No Database)'
  });
});

// Get all problem statements with pagination and filtering (in-memory)
router.get('/problems', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      year, 
      category, 
      search,
      sortBy = 'year',
      sortOrder = 'desc'
    } = req.query;

    // For now, we'll scrape fresh data each time (you could add caching later)
    let allProblems = [];
    
    // If specific year requested, only scrape that year
    if (year) {
      const yearInt = parseInt(year);
      if (yearInt >= 2015 && yearInt <= 2025) {
        const result = await scraper.scrapeYear(yearInt);
        if (result.status === 'completed') {
          allProblems = result.problems;
        }
      }
    } else {
      // Scrape all years (this might take a while)
      const results = await scraper.scrapeAllYears();
      allProblems = results.flatMap(result => result.problems || []);
    }

    // Apply filters
    let filteredProblems = allProblems;
    
    if (category) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.category && problem.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (search) {
      filteredProblems = filteredProblems.filter(problem => 
        (problem.title && problem.title.toLowerCase().includes(search.toLowerCase())) ||
        (problem.description && problem.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply sorting
    filteredProblems.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

    // Apply pagination
    const total = filteredProblems.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProblems = filteredProblems.slice(offset, offset + parseInt(limit));
    
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: paginatedProblems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      message: 'Data scraped fresh from SIH website (no database storage)'
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problem statements',
      message: error.message
    });
  }
});

// Get problem statement by ID (search in scraped data)
router.get('/problems/:id', async (req, res) => {
  try {
    const problemId = req.params.id;
    
    // Scrape all years to find the specific problem
    const results = await scraper.scrapeAllYears();
    const allProblems = results.flatMap(result => result.problems || []);
    
    const problem = allProblems.find(p => p.problemId === problemId);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem statement not found'
      });
    }

    res.json({
      success: true,
      data: problem
    });

  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problem statement',
      message: error.message
    });
  }
});

// Get statistics and analytics (from scraped data)
router.get('/stats', async (req, res) => {
  try {
    const results = await scraper.scrapeAllYears();
    const allProblems = results.flatMap(result => result.problems || []);
    
    // Calculate statistics
    const totalProblems = allProblems.length;
    
    const yearStats = {};
    const categoryStats = {};
    const organizationStats = {};
    
    allProblems.forEach(problem => {
      // Year stats
      if (problem.year) {
        yearStats[problem.year] = (yearStats[problem.year] || 0) + 1;
      }
      
      // Category stats
      if (problem.category) {
        categoryStats[problem.category] = (categoryStats[problem.category] || 0) + 1;
      }
      
      // Organization stats
      if (problem.organizationName) {
        organizationStats[problem.organizationName] = (organizationStats[problem.organizationName] || 0) + 1;
      }
    });
    
    // Convert to arrays for response
    const yearStatsArray = Object.entries(yearStats).map(([year, count]) => ({ _id: year, count }));
    const categoryStatsArray = Object.entries(categoryStats).map(([category, count]) => ({ _id: category, count }));
    const organizationStatsArray = Object.entries(organizationStats).map(([org, count]) => ({ _id: org, count }));

    res.json({
      success: true,
      data: {
        totalProblems,
        yearStats: yearStatsArray.sort((a, b) => b._id - a._id),
        categoryStats: categoryStatsArray.sort((a, b) => b.count - a.count).slice(0, 10),
        organizationStats: organizationStatsArray.sort((a, b) => b.count - a.count).slice(0, 10)
      },
      message: 'Statistics calculated from fresh scraped data'
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Scraping endpoints
router.post('/scrape/start', async (req, res) => {
  try {
    const { years } = req.body;
    
    // Start scraping in background
    const scraperInstance = new SimpleSIHScraper();
    
    // If specific years provided, filter them
    if (years && Array.isArray(years)) {
      scraperInstance.years = scraperInstance.years.filter(year => years.includes(year));
    }
    
    // Start scraping asynchronously
    scraperInstance.scrapeAllYears().then(results => {
      console.log('Background scraping completed:', results);
    }).catch(error => {
      console.error('Background scraping failed:', error);
    });

    res.json({
      success: true,
      message: 'Scraping started successfully',
      years: scraperInstance.years,
      estimatedTime: `${scraperInstance.years.length * 2} minutes`,
      note: 'Data is not stored in database, only returned in API responses'
    });

  } catch (error) {
    console.error('Error starting scraping:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start scraping',
      message: error.message
    });
  }
});

// Force scrape specific year
router.post('/scrape/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    
    if (year < 2015 || year > 2025) {
      return res.status(400).json({
        success: false,
        error: 'Invalid year. Must be between 2015 and 2025'
      });
    }

    const scraperInstance = new SimpleSIHScraper();
    scraperInstance.years = [year];
    
    const result = await scraperInstance.scrapeAllYears();
    
    res.json({
      success: true,
      message: `Scraping completed for year ${year}`,
      result: result[0],
      note: 'Data is not stored in database, only returned in API responses'
    });

  } catch (error) {
    console.error('Error scraping specific year:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scrape specific year',
      message: error.message
    });
  }
});

// Test endpoint to see if scraping works
router.get('/test-scraping', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Testing scraping functionality...',
      note: 'This endpoint will start a test scrape of year 2025'
    });
    
    // Start a test scrape in the background
    setTimeout(async () => {
      try {
        const testResult = await scraper.scrapeYear(2025);
        console.log('Test scraping result:', testResult);
      } catch (error) {
        console.error('Test scraping failed:', error);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Test endpoint failed',
      message: error.message
    });
  }
});

module.exports = router;
