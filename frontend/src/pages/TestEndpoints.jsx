import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PlayArrow as TestIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const endpoints = [
  { name: 'Health Check', method: 'GET', path: '/api/health', test: () => apiService.getHealth() },
  { name: 'Dashboard Stats', method: 'GET', path: '/api/stats', test: () => apiService.getStats() },
  { name: 'Problems List', method: 'GET', path: '/api/problems', test: () => apiService.getProblems({ page: 1, limit: 5 }) },
  { name: 'Analytics Frequency', method: 'GET', path: '/api/analytics/frequency', test: () => apiService.getAnalyticsFrequency() },
  { name: 'Analytics Trends', method: 'GET', path: '/api/analytics/trends', test: () => apiService.getAnalyticsTrends() },
  { name: 'Export Files', method: 'GET', path: '/api/export/files', test: () => apiService.getExportFiles() },
  { name: 'Scraping Status', method: 'GET', path: '/api/scrape/status', test: () => apiService.getScrapingStatus() },
];

function TestEndpoints() {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [overallStatus, setOverallStatus] = useState('idle');

  const testEndpoint = async (endpoint) => {
    try {
      const startTime = Date.now();
      const result = await endpoint.test();
      const duration = Date.now() - startTime;
      
      setResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: 'success',
          data: result,
          duration,
          timestamp: new Date().toISOString(),
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      }));
    }
  };

  const testAllEndpoints = async () => {
    setTesting(true);
    setOverallStatus('testing');
    
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
    setOverallStatus('completed');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      default: return null;
    }
  };

  const successCount = Object.values(results).filter(r => r.status === 'success').length;
  const errorCount = Object.values(results).filter(r => r.status === 'error').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          API Endpoints Test
        </Typography>
        <Button
          variant="contained"
          startIcon={testing ? <LinearProgress /> : <TestIcon />}
          onClick={testAllEndpoints}
          disabled={testing}
        >
          {testing ? 'Testing...' : 'Test All Endpoints'}
        </Button>
      </Box>

      {/* Summary */}
      {overallStatus !== 'idle' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Test Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {endpoints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Endpoints
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {successCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {errorCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {successCount > 0 ? Math.round((successCount / endpoints.length) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Endpoints List */}
      <Grid container spacing={3}>
        {endpoints.map((endpoint) => {
          const result = results[endpoint.name];
          
          return (
            <Grid item xs={12} md={6} key={endpoint.name}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {endpoint.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={endpoint.method}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {result && (
                        <Chip
                          icon={getStatusIcon(result.status)}
                          label={result.status}
                          size="small"
                          color={getStatusColor(result.status)}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {endpoint.path}
                  </Typography>

                  {result && (
                    <Box sx={{ mt: 2 }}>
                      {result.status === 'success' ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            Response received in {result.duration}ms
                          </Typography>
                        </Alert>
                      ) : (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            {result.error}
                          </Typography>
                        </Alert>
                      )}
                      
                      <Typography variant="caption" color="text.secondary">
                        Tested at {new Date(result.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => testEndpoint(endpoint)}
                      disabled={testing}
                    >
                      Test This Endpoint
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Instructions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            How to Use This Test Page
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Test Individual Endpoints"
                secondary="Click 'Test This Endpoint' on any card to test a specific API endpoint"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Test All Endpoints"
                secondary="Click 'Test All Endpoints' to run tests on all available API endpoints"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Monitor Results"
                secondary="Green chips indicate successful responses, red chips indicate errors"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Response Times"
                secondary="Successful tests show response time in milliseconds"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TestEndpoints;
