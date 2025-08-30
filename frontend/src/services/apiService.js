import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || error.response.data?.message || 'API request failed');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Request configuration error');
    }
  }
);

export const apiService = {
  // Health check
  async getHealth() {
    return await apiClient.get('/health');
  },

  // Statistics
  async getStats() {
    return await apiClient.get('/stats');
  },

  // Problem statements
  async getProblems(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.year) queryParams.append('year', params.year);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.organization) queryParams.append('organization', params.organization);

    const url = `/problems${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(url);
  },

  async getProblemById(id) {
    return await apiClient.get(`/problems/${id}`);
  },

  // Analytics
  async getAnalyticsFrequency() {
    return await apiClient.get('/analytics/frequency');
  },

  async getAnalyticsTrends() {
    return await apiClient.get('/analytics/trends');
  },

  // Exports
  async getExportFiles() {
    return await apiClient.get('/export/files');
  },

  async exportByCategory(category) {
    return await apiClient.get(`/export/category/${category}`);
  },

  async exportByYear(year) {
    return await apiClient.get(`/export/year/${year}`);
  },

  async exportAll() {
    return await apiClient.get('/export/all');
  },

  // Scraping
  async scrapeYear(year) {
    return await apiClient.post(`/scrape/year/${year}`);
  },

  // AI Analysis
  async queryGemini(query) {
    return await apiClient.post('/gemini/query', { query });
  },

  // Utility methods
  getDownloadUrl(filename) {
    return `${API_BASE_URL}/download/${filename}`;
  },

  // Error handling helper
  handleError(error) {
    console.error('API Service Error:', error);
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Internal server error');
    } else if (error.response?.status >= 400) {
      throw new Error(error.response.data?.error || 'Bad request');
    } else {
      throw new Error(error.message || 'Unknown error occurred');
    }
  },
};

export default apiService;
