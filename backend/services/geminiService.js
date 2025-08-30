const axios = require('axios');
const ProblemStatement = require('../models/ProblemStatement');
const { Op } = require('sequelize');
require('dotenv').config();

class GeminiService {
  constructor() {
    const config = require('../config/config');
    this.apiKey = config.gemini.apiKey;
    this.model = config.gemini.model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models';
    
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
  }

  async generateResponse(userQuery, contextData = null) {
    try {
      // If no context provided, fetch relevant data from database
      if (!contextData) {
        contextData = await this.getRelevantContext(userQuery);
      }

      // Prepare the prompt with context
      const prompt = this.buildPrompt(userQuery, contextData);
      
      // Call Gemini API
      const response = await this.callGeminiAPI(prompt);
      
      return {
        success: true,
        response: response,
        contextUsed: contextData.length,
        query: userQuery
      };
      
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      return {
        success: false,
        error: error.message,
        query: userQuery
      };
    }
  }

  async getRelevantContext(userQuery) {
    try {
      // Analyze query to determine what data to fetch
      const queryAnalysis = this.analyzeQuery(userQuery);
      
      let whereClause = {};
      
      // Build Sequelize where clause based on analysis
      if (queryAnalysis.years && queryAnalysis.years.length > 0) {
        whereClause.year = { [Op.in]: queryAnalysis.years };
      }
      
      if (queryAnalysis.categories && queryAnalysis.categories.length > 0) {
        whereClause.category = { [Op.in]: queryAnalysis.categories };
      }
      
      if (queryAnalysis.organizations && queryAnalysis.organizations.length > 0) {
        whereClause.organizationName = { [Op.in]: queryAnalysis.organizations };
      }
      
      if (queryAnalysis.technologies && queryAnalysis.technologies.length > 0) {
        whereClause.technology = { [Op.overlap]: queryAnalysis.technologies };
      }
      
      // If it's a frequency analysis query, get all data
      if (queryAnalysis.isFrequencyAnalysis) {
        whereClause = {};
      }
      
      // Limit results to avoid overwhelming the API
      const limit = queryAnalysis.isFrequencyAnalysis ? 1000 : 100;
      
      const problems = await ProblemStatement.findAll({
        where: whereClause,
        limit: limit,
        attributes: ['title', 'description', 'category', 'year', 'organizationName', 'technology', 'domain', 'tags']
      });
      
      return problems.map(p => p.toJSON());
      
    } catch (error) {
      console.error('Error fetching relevant context:', error);
      return [];
    }
  }

  analyzeQuery(userQuery) {
    const query = userQuery.toLowerCase();
    const analysis = {
      years: [],
      categories: [],
      organizations: [],
      technologies: [],
      isFrequencyAnalysis: false
    };
    
    // Extract years (2020-2025)
    const yearMatches = query.match(/\b(20[12]\d)\b/g);
    if (yearMatches) {
      analysis.years = yearMatches.map(y => parseInt(y));
    }
    
    // Extract categories
    const categoryKeywords = [
      'healthcare', 'education', 'agriculture', 'transport', 'energy',
      'environment', 'finance', 'security', 'communication', 'smart city',
      'rural', 'urban', 'technology', 'innovation'
    ];
    
    categoryKeywords.forEach(category => {
      if (query.includes(category)) {
        analysis.categories.push(category);
      }
    });
    
    // Extract organizations
    const orgKeywords = [
      'government', 'ministry', 'department', 'institute', 'university',
      'college', 'hospital', 'bank', 'corporation'
    ];
    
    orgKeywords.forEach(org => {
      if (query.includes(org)) {
        analysis.organizations.push(org);
      }
    });
    
    // Extract technologies
    const techKeywords = [
      'ai', 'machine learning', 'blockchain', 'iot', 'mobile app',
      'web app', 'data analytics', 'cybersecurity', 'cloud computing'
    ];
    
    techKeywords.forEach(tech => {
      if (query.includes(tech)) {
        analysis.technologies.push(tech);
      }
    });
    
    // Check if it's a frequency analysis query
    analysis.isFrequencyAnalysis = query.includes('frequent') || 
                                  query.includes('most common') || 
                                  query.includes('top') ||
                                  query.includes('frequency') ||
                                  query.includes('trend');
    
    return analysis;
  }

  buildPrompt(userQuery, contextData) {
    let contextText = '';
    
    if (contextData && contextData.length > 0) {
      contextText = contextData.map((problem, index) => {
        return `Problem ${index + 1}:
Title: ${problem.title}
Description: ${problem.description}
Category: ${problem.category}
Year: ${problem.year}
Organization: ${problem.organizationName || 'N/A'}
Technologies: ${problem.technology?.join(', ') || 'N/A'}
Tags: ${problem.tags?.join(', ') || 'N/A'}
---`;
      }).join('\n\n');
    }
    
    const prompt = `You are an expert analyst for Smart India Hackathon (SIH) data. 
You have access to the following problem statements from various SIH editions:

${contextText}

Based on this data, please answer the following user query: "${userQuery}"

Provide a comprehensive, well-structured response that:
1. Directly addresses the user's question
2. Uses specific examples from the provided data when relevant
3. Includes statistics and insights if the data supports them
4. Suggests patterns or trends if applicable
5. Is helpful for students, researchers, or anyone interested in SIH

If the query is about frequency analysis, provide specific counts and percentages.
If the query is about trends, analyze patterns across different years.
If the query is about specific categories or technologies, focus on relevant examples.

Please format your response in a clear, readable manner.`;

    return prompt;
  }

  async callGeminiAPI(prompt) {
    try {
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };
      
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      });
      
      if (response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
      
    } catch (error) {
      if (error.response) {
        throw new Error(`Gemini API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response received from Gemini API');
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  // Helper method for specific types of queries
  async getFrequencyAnalysis() {
    try {
      const { sequelize } = require('../config/database');
      const result = await ProblemStatement.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      return result.map(r => ({
        _id: r.category,
        count: parseInt(r.dataValues.count),
        problems: [] // Would need additional query to get problems
      }));
      
    } catch (error) {
      console.error('Error in frequency analysis:', error);
      throw error;
    }
  }

  async getYearlyTrends() {
    try {
      const { sequelize } = require('../config/database');
      const result = await ProblemStatement.findAll({
        attributes: [
          'year',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['year'],
        order: [['year', 'ASC']]
      });
      
      return result.map(r => ({
        _id: r.year,
        count: parseInt(r.dataValues.count),
        categories: [] // Would need additional query to get categories
      }));
      
    } catch (error) {
      console.error('Error in yearly trends analysis:', error);
      throw error;
    }
  }
}

module.exports = GeminiService;
