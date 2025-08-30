const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

class SimpleCSVService {
  constructor() {
    this.outputDir = path.join(__dirname, '../exports');
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  getExportDirectory() {
    return this.outputDir;
  }

  async exportAllData(problems, filename = null) {
    try {
      console.log('Starting CSV export of all SIH data...');
      
      if (!problems || problems.length === 0) {
        throw new Error('No data provided for export');
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
      const csvData = problems.map(problem => ({
        problemId: problem.problemId || '',
        title: problem.title || '',
        description: (problem.description || '').replace(/\n/g, ' ').replace(/\r/g, ' '),
        category: problem.category || '',
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
        message: `Successfully exported ${csvData.length} records to ${filename}`,
        filename: filename,
        recordCount: csvData.length,
        filepath: filepath
      };
      
    } catch (error) {
      console.error('Error in CSV export:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async exportByYear(problems, year, filename = null) {
    try {
      const yearProblems = problems.filter(p => p.year === year);
      
      if (yearProblems.length === 0) {
        throw new Error(`No problems found for year ${year}`);
      }
      
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `sih_${year}_${timestamp}.csv`;
      }
      
      return await this.exportAllData(yearProblems, filename);
      
    } catch (error) {
      console.error('Error in year export:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async exportByCategory(problems, category, filename = null) {
    try {
      const categoryProblems = problems.filter(p => 
        p.category && p.category.toLowerCase().includes(category.toLowerCase())
      );
      
      if (categoryProblems.length === 0) {
        throw new Error(`No problems found for category ${category}`);
      }
      
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `sih_category_${category}_${timestamp}.csv`;
      }
      
      return await this.exportAllData(categoryProblems, filename);
      
    } catch (error) {
      console.error('Error in category export:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  listExportedFiles() {
    try {
      const files = fs.readdirSync(this.outputDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => {
          const filepath = path.join(this.outputDir, file);
          const stats = fs.statSync(filepath);
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
        .sort((a, b) => b.modified - a.modified);
      
      return files;
      
    } catch (error) {
      console.error('Error listing exported files:', error);
      return [];
    }
  }
}

module.exports = SimpleCSVService;
