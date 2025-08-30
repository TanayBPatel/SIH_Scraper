const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const ProblemStatement = require('../models/ProblemStatement');
const ScrapingSession = require('../models/ScrapingSession');
const GeminiService = require('../services/geminiService');
const SimpleCSVService = require('../services/simpleCsvService');
const SIHScraper = require('../services/scraper');

// Initialize services
const geminiService = new GeminiService();
const csvService = new SimpleCSVService();

// Middleware for rate limiting
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // limit each IP to 100 requests per windowMs
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
    service: 'SIH Data API'
  });
});

// Get all problem statements with pagination and filtering
router.get('/problems', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      year, 
      category, 
      organization, 
      technology,
      search,
      sortBy = 'year',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause for Sequelize
    let whereClause = {};
    
    if (year) {
      if (year.includes('-')) {
        const [startYear, endYear] = year.split('-').map(y => parseInt(y));
        whereClause.year = { [sequelize.Op.between]: [startYear, endYear] };
      } else {
        whereClause.year = parseInt(year);
      }
    }
    
    if (category) {
              whereClause.category = { [Op.iLike]: `%${category}%` };
    }
    
    if (organization) {
              whereClause.organizationName = { [Op.iLike]: `%${organization}%` };
    }
    
    if (technology) {
      whereClause.technology = { [sequelize.Op.overlap]: [technology] };
    }
    
    if (search) {
              whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Build sort array for Sequelize
    const order = [[sortBy, sortOrder.toUpperCase()]];

    // Execute query with pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const [problems, total] = await Promise.all([
      ProblemStatement.findAll({
        where: whereClause,
        order: order,
        offset: offset,
        limit: parseInt(limit)
      }),
      ProblemStatement.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
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

// Get problem statement by ID
router.get('/problems/:id', async (req, res) => {
  try {
    const problem = await ProblemStatement.findByPk(req.params.id);
    
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

// Get statistics and analytics
router.get('/stats', async (req, res) => {
  try {
    const [totalProblems, yearStats, categoryStats, organizationStats] = await Promise.all([
      ProblemStatement.count(),
      sequelize.query(`
        SELECT year as "_id", COUNT(*) as "count" 
        FROM problem_statements 
        GROUP BY year 
        ORDER BY year DESC
      `, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`
        SELECT category as "_id", COUNT(*) as "count" 
        FROM problem_statements 
        GROUP BY category 
        ORDER BY "count" DESC 
        LIMIT 10
      `, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`
        SELECT "organizationName" as "_id", COUNT(*) as "count" 
        FROM problem_statements 
        WHERE "organizationName" IS NOT NULL
        GROUP BY "organizationName" 
        ORDER BY "count" DESC 
        LIMIT 10
      `, { type: sequelize.QueryTypes.SELECT })
    ]);

    res.json({
      success: true,
      data: {
        totalProblems,
        yearStats,
        categoryStats,
        organizationStats
      }
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

// Gemini API integration endpoint
router.post('/gemini/query', async (req, res) => {
  try {
    const { query, contextData } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const result = await geminiService.generateResponse(query, contextData);
    
    res.json(result);

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process Gemini query',
      message: error.message
    });
  }
});

// Get frequency analysis
router.get('/analytics/frequency', async (req, res) => {
  try {
    const result = await geminiService.getFrequencyAnalysis();
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in frequency analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate frequency analysis',
      message: error.message
    });
  }
});

// Get yearly trends
router.get('/analytics/trends', async (req, res) => {
  try {
    const result = await geminiService.getYearlyTrends();
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in yearly trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate yearly trends',
      message: error.message
    });
  }
});

// CSV Export endpoints
router.get('/export/all', async (req, res) => {
  try {
    // Fetch all problems from database
    const problems = await ProblemStatement.findAll({
      order: [['year', 'DESC'], ['category', 'ASC']]
    });
    
    const result = await csvService.exportAllData(problems);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        filename: result.filename,
        recordCount: result.recordCount,
        downloadUrl: `/api/download/${result.filename}`
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in CSV export:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV',
      message: error.message
    });
  }
});

router.get('/export/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    
    // Fetch problems for specific year
    const problems = await ProblemStatement.findAll({
      where: { year: year },
      order: [['category', 'ASC']]
    });
    
    if (problems.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No problems found for year ${year}`
      });
    }
    
    const result = await csvService.exportByYear(problems, year);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        filename: result.filename,
        recordCount: result.recordCount,
        year: year,
        downloadUrl: `/api/download/${result.filename}`
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in CSV export by year:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV by year',
      message: error.message
    });
  }
});

router.get('/export/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    // Fetch problems for specific category
    const problems = await ProblemStatement.findAll({
      where: { 
        category: { [Op.iLike]: `%${category}%` }
      },
      order: [['year', 'DESC']]
    });
    
    if (problems.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No problems found for category ${category}`
      });
    }
    
    const result = await csvService.exportByCategory(problems, category);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        filename: result.filename,
        recordCount: result.recordCount,
        category: category,
        downloadUrl: `/api/download/${result.filename}`
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in CSV export by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV by category',
      message: error.message
    });
  }
});

// Download CSV files
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = csvService.getExportDirectory() + '/' + filename;
    
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }
    });

  } catch (error) {
    console.error('Error in file download:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file',
      message: error.message
    });
  }
});

// List exported files
router.get('/export/files', (req, res) => {
  try {
    const files = csvService.listExportedFiles();
    
    res.json({
      success: true,
      data: files,
      exportDirectory: csvService.getExportDirectory()
    });

  } catch (error) {
    console.error('Error listing exported files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list exported files',
      message: error.message
    });
  }
});

// Scraping endpoints
router.post('/scrape/start', async (req, res) => {
  try {
    const { years } = req.body;
    
    // Check if scraping is already in progress
    const inProgressSession = await ScrapingSession.findOne({ where: { status: 'in_progress' } });
    if (inProgressSession) {
      return res.status(409).json({
        success: false,
        error: 'Scraping already in progress',
        currentSession: inProgressSession
      });
    }

    // Start scraping in background
    const scraper = new SIHScraper();
    
    // If specific years provided, filter them
    if (years && Array.isArray(years)) {
      scraper.years = scraper.years.filter(year => years.includes(year));
    }
    
    // Start scraping asynchronously
    scraper.scrapeAllYears().then(results => {
      console.log('Background scraping completed:', results);
    }).catch(error => {
      console.error('Background scraping failed:', error);
    });

    res.json({
      success: true,
      message: 'Scraping started successfully',
      years: scraper.years,
      estimatedTime: `${scraper.years.length * 2} minutes`
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

// Get scraping status
router.get('/scrape/status', async (req, res) => {
  try {
    const sessions = await ScrapingSession.findAll({
      order: [['year', 'DESC']]
    });

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching scraping status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scraping status',
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

    const scraper = new SIHScraper();
    scraper.years = [year];
    
    const result = await scraper.scrapeAllYears();
    
    res.json({
      success: true,
      message: `Scraping completed for year ${year}`,
      result: result[0]
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

module.exports = router;
