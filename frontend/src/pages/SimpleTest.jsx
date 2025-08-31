import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { apiService } from '../services/apiService';

function SimpleTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      console.log(`Running test: ${testName}`);
      const result = await testFunction();
      console.log(`Test ${testName} result:`, result);
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    await runTest('Health Check', () => apiService.getHealth());
    await runTest('Test Endpoint', () => apiService.testEndpoint());
    await runTest('Stats', () => apiService.getStats());
    
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Simple API Test
      </Typography>

      <Button
        variant="contained"
        onClick={runAllTests}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? 'Running Tests...' : 'Run All Tests'}
      </Button>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(testResults).map(([testName, result]) => (
          <Card key={testName}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                {testName}
              </Typography>
              
              {result.success ? (
                <Alert severity="success">
                  <Typography variant="body2">
                    ✅ Test passed
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Response: {JSON.stringify(result.data, null, 2)}
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="error">
                  <Typography variant="body2">
                    ❌ Test failed: {result.error}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {Object.keys(testResults).length === 0 && !loading && (
        <Alert severity="info">
          Click "Run All Tests" to test the API endpoints
        </Alert>
      )}
    </Box>
  );
}

export default SimpleTest;
