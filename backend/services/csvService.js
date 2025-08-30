const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ProblemStatement = require('../models/ProblemStatement');
const path = require('path');
const fs = require('fs');

class CSVService {
  constructor() {
    this.outputDir = path.join(__dirname, '../exports');
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async exportAllData(filename = null) {
    try {
      console.log('Starting CSV export of all SIH data...');
      
      // Fetch all problem statements
      const problems = await ProblemStatement.findAll({
        order: [['year', 'DESC'], ['category', 'ASC']]
      });
      
      const problemsData = problems.map(p => p.toJSON());
      
      if (problemsData.length === 0) {
        throw new Error('No data found to export');
      }
      
      // Generate filename if not provided
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `sih_data_${timestamp}.csv`;
      }
      
      const filepath = path.join(this.outputDir, filename);
      
      // Define CSV headers
      const csvWriter = createCsvWriter({
        path: filepath,
        header: [
          { id: 'problemId', title: 'Problem ID' },
          { id: 'title', title: 'Title' },
          { id: 'description', title: 'Description' },
          { id: 'category', title: 'Category' },
          { id: 'subCategory', title: 'Sub Category' },
          { id: 'year', title: 'Year' },
          { id: 'edition', title: 'Edition' },
          { id: 'organizationName', title: 'Organization Name' },
          { id: 'organizationType', title: 'Organization Type' },
          { id: 'organizationSector', title: 'Organization Sector' },
          { id: 'technology', title: 'Technologies' },
          { id: 'domain', title: 'Domains' },
          { id: 'difficulty', title: 'Difficulty' },
          { id: 'expectedOutcome', title: 'Expected Outcome' },
          { id: 'constraints', title: 'Constraints' },
          { id: 'resources', title: 'Resources' },
          { id: 'tags', title: 'Tags' },
          { id: 'complexity', title: 'Complexity' },
          { id: 'estimatedEffort', title: 'Estimated Effort' },
          { id: 'scrapedAt', title: 'Scraped At' },
          { id: 'lastUpdated', title: 'Last Updated' }
        ]
      });
      
      // Transform data for CSV
      const csvData = problemsData.map(problem => ({
        problemId: problem.problemId || '',
        title: problem.title || '',
        description: (problem.description || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        category: problem.category || '',
        subCategory: problem.subCategory || '',
        year: problem.year || '',
        edition: problem.edition || '',
        organizationName: problem.organizationName || '',
        organizationType: problem.organizationType || '',
        organizationSector: problem.organizationSector || '',
        technology: Array.isArray(problem.technology) ? problem.technology.join('; ') : '',
        domain: Array.isArray(problem.domain) ? problem.domain.join('; ') : '',
        difficulty: problem.difficulty || '',
        expectedOutcome: (problem.expectedOutcome || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        constraints: Array.isArray(problem.constraints) ? problem.constraints.join('; ') : '',
        resources: Array.isArray(problem.resources) ? problem.resources.join('; ') : '',
        tags: Array.isArray(problem.tags) ? problem.tags.join('; ') : '',
        complexity: problem.complexity || '',
        estimatedEffort: problem.estimatedEffort || '',
        scrapedAt: problem.scrapedAt ? new Date(problem.scrapedAt).toISOString() : '',
        lastUpdated: problem.lastUpdated ? new Date(problem.lastUpdated).toISOString() : ''
      }));
      
      // Write CSV file
      await csvWriter.writeRecords(csvData);
      
      console.log(`CSV export completed: ${filepath}`);
      console.log(`Total records exported: ${csvData.length}`);
      
      return {
        success: true,
        filepath: filepath,
        filename: filename,
        recordCount: csvData.length,
        message: `Successfully exported ${csvData.length} records to ${filename}`
      };
      
    } catch (error) {
      console.error('Error in CSV export:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to export CSV'
      };
    }
  }

  async exportByYear(year, filename = null) {
    try {
      console.log(`Starting CSV export for SIH ${year}...`);
      
      // Fetch problems for specific year
      const problems = await ProblemStatement.findAll({
        where: { year },
        order: [['category', 'ASC']]
      });
      
      const problemsData = problems.map(p => p.toJSON());
      
      if (problemsData.length === 0) {
        throw new Error(`No data found for year ${year}`);
      }
      
      // Generate filename if not provided
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `sih_${year}_${timestamp}.csv`;
      }
      
      const filepath = path.join(this.outputDir, filename);
      
      // Define CSV headers (same as above)
      const csvWriter = createCsvWriter({
        path: filepath,
        header: [
          { id: 'problemId', title: 'Problem ID' },
          { id: 'title', title: 'Title' },
          { id: 'description', title: 'Description' },
          { id: 'category', title: 'Category' },
          { id: 'subCategory', title: 'Sub Category' },
          { id: 'year', title: 'Year' },
          { id: 'edition', title: 'Edition' },
          { id: 'organizationName', title: 'Organization Name' },
          { id: 'organizationType', title: 'Organization Type' },
          { id: 'organizationSector', title: 'Organization Sector' },
          { id: 'technology', title: 'Technologies' },
          { id: 'domain', title: 'Domains' },
          { id: 'difficulty', title: 'Difficulty' },
          { id: 'expectedOutcome', title: 'Expected Outcome' },
          { id: 'constraints', title: 'Constraints' },
          { id: 'resources', title: 'Resources' },
          { id: 'tags', title: 'Tags' },
          { id: 'complexity', title: 'Complexity' },
          { id: 'estimatedEffort', title: 'Estimated Effort' },
          { id: 'scrapedAt', title: 'Scraped At' },
          { id: 'lastUpdated', title: 'Last Updated' }
        ]
      });
      
      // Transform data for CSV
      const csvData = problemsData.map(problem => ({
        problemId: problem.problemId || '',
        title: problem.title || '',
        description: (problem.description || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        category: problem.category || '',
        subCategory: problem.subCategory || '',
        year: problem.year || '',
        edition: problem.edition || '',
        organizationName: problem.organizationName || '',
        organizationType: problem.organizationType || '',
        organizationSector: problem.organizationSector || '',
        technology: Array.isArray(problem.technology) ? problem.technology.join('; ') : '',
        domain: Array.isArray(problem.domain) ? problem.domain.join('; ') : '',
        difficulty: problem.difficulty || '',
        expectedOutcome: (problem.expectedOutcome || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        constraints: Array.isArray(problem.constraints) ? problem.constraints.join('; ') : '',
        resources: Array.isArray(problem.resources) ? problem.resources.join('; ') : '',
        tags: Array.isArray(problem.tags) ? problem.tags.join('; ') : '',
        complexity: problem.complexity || '',
        estimatedEffort: problem.estimatedEffort || '',
        scrapedAt: problem.scrapedAt ? new Date(problem.scrapedAt).toISOString() : '',
        lastUpdated: problem.lastUpdated ? new Date(problem.lastUpdated).toISOString() : ''
      }));
      
      // Write CSV file
      await csvWriter.writeRecords(csvData);
      
      console.log(`CSV export for year ${year} completed: ${filepath}`);
      console.log(`Records exported: ${csvData.length}`);
      
      return {
        success: true,
        filepath: filepath,
        filename: filename,
        recordCount: csvData.length,
        year: year,
        message: `Successfully exported ${csvData.length} records for SIH ${year} to ${filename}`
      };
      
    } catch (error) {
      console.error(`Error in CSV export for year ${year}:`, error);
      return {
        success: false,
        error: error.message,
        year: year,
        message: `Failed to export CSV for year ${year}`
      };
    }
  }

  async exportByCategory(category, filename = null) {
    try {
      console.log(`Starting CSV export for category: ${category}...`);
      
      // Fetch problems for specific category
      const { Op } = require('sequelize');
      const problems = await ProblemStatement.findAll({
        where: {
          category: { [Op.iLike]: `%${category}%` }
        },
        order: [['year', 'DESC'], ['title', 'ASC']]
      });
      
      const problemsData = problems.map(p => p.toJSON());
      
      if (problemsData.length === 0) {
        throw new Error(`No data found for category: ${category}`);
      }
      
      // Generate filename if not provided
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `sih_category_${category.replace(/\s+/g, '_')}_${timestamp}.csv`;
      }
      
      const filepath = path.join(this.outputDir, filename);
      
      // Use same CSV structure as above
      const csvWriter = createCsvWriter({
        path: filepath,
        header: [
          { id: 'problemId', title: 'Problem ID' },
          { id: 'title', title: 'Title' },
          { id: 'description', title: 'Description' },
          { id: 'category', title: 'Category' },
          { id: 'subCategory', title: 'Sub Category' },
          { id: 'year', title: 'Year' },
          { id: 'edition', title: 'Edition' },
          { id: 'organizationName', title: 'Organization Name' },
          { id: 'organizationType', title: 'Organization Type' },
          { id: 'organizationSector', title: 'Organization Sector' },
          { id: 'technology', title: 'Technologies' },
          { id: 'domain', title: 'Domains' },
          { id: 'difficulty', title: 'Difficulty' },
          { id: 'expectedOutcome', title: 'Expected Outcome' },
          { id: 'constraints', title: 'Constraints' },
          { id: 'resources', title: 'Resources' },
          { id: 'tags', title: 'Tags' },
          { id: 'complexity', title: 'Complexity' },
          { id: 'estimatedEffort', title: 'Estimated Effort' },
          { id: 'scrapedAt', title: 'Scraped At' },
          { id: 'lastUpdated', title: 'Last Updated' }
        ]
      });
      
      // Transform data for CSV
      const csvData = problemsData.map(problem => ({
        problemId: problem.problemId || '',
        title: problem.title || '',
        description: (problem.description || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        category: problem.category || '',
        subCategory: problem.subCategory || '',
        year: problem.year || '',
        edition: problem.edition || '',
        organizationName: problem.organizationName || '',
        organizationType: problem.organizationType || '',
        organizationSector: problem.organizationSector || '',
        technology: Array.isArray(problem.technology) ? problem.technology.join('; ') : '',
        domain: Array.isArray(problem.domain) ? problem.domain.join('; ') : '',
        difficulty: problem.difficulty || '',
        expectedOutcome: (problem.expectedOutcome || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        constraints: Array.isArray(problem.constraints) ? problem.constraints.join('; ') : '',
        resources: Array.isArray(problem.resources) ? problem.resources.join('; ') : '',
        tags: Array.isArray(problem.tags) ? problem.tags.join('; ') : '',
        complexity: problem.complexity || '',
        estimatedEffort: problem.estimatedEffort || '',
        scrapedAt: problem.scrapedAt ? new Date(problem.scrapedAt).toISOString() : '',
        lastUpdated: problem.lastUpdated ? new Date(problem.lastUpdated).toISOString() : ''
      }));
      
      // Write CSV file
      await csvWriter.writeRecords(csvData);
      
      console.log(`CSV export for category ${category} completed: ${filepath}`);
      console.log(`Records exported: ${csvData.length}`);
      
      return {
        success: true,
        filepath: filepath,
        filename: filename,
        recordCount: csvData.length,
        category: category,
        message: `Successfully exported ${csvData.length} records for category ${category} to ${filename}`
      };
      
    } catch (error) {
      console.error(`Error in CSV export for category ${category}:`, error);
      return {
        success: false,
        error: error.message,
        category: category,
        message: `Failed to export CSV for category ${category}`
      };
    }
  }

  getExportDirectory() {
    return this.outputDir;
  }

  listExportedFiles() {
    try {
      const files = fs.readdirSync(this.outputDir);
      return files.filter(file => file.endsWith('.csv'));
    } catch (error) {
      console.error('Error listing exported files:', error);
      return [];
    }
  }
}

module.exports = CSVService;
