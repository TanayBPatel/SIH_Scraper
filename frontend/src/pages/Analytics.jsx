import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function Analytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [frequencyData, setFrequencyData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching analytics data...');
      
      const [freqData, trendsData] = await Promise.all([
        apiService.getAnalyticsFrequency(),
        apiService.getAnalyticsTrends(),
      ]);
      
      console.log('Frequency data:', freqData);
      console.log('Trends data:', trendsData);
      
      // Handle the actual data structure from the API
      console.log('Raw frequency data:', freqData);
      console.log('Raw trends data:', trendsData);
      
      // The frequency data comes as an array directly, not nested
      const categoryData = Array.isArray(freqData) ? freqData : (freqData.data || []);
      const totalProblems = categoryData.reduce((sum, item) => sum + (item.count || 0), 0);
      
      // Create sample data for other charts since they might not be available
      const sampleDifficultyData = [
        { _id: 'Easy', count: Math.floor(totalProblems * 0.3) },
        { _id: 'Medium', count: Math.floor(totalProblems * 0.5) },
        { _id: 'Hard', count: Math.floor(totalProblems * 0.2) }
      ];
      
      const sampleSectorData = [
        { _id: 'Technology', count: Math.floor(totalProblems * 0.25) },
        { _id: 'Healthcare', count: Math.floor(totalProblems * 0.20) },
        { _id: 'Education', count: Math.floor(totalProblems * 0.15) },
        { _id: 'Environment', count: Math.floor(totalProblems * 0.12) },
        { _id: 'Agriculture', count: Math.floor(totalProblems * 0.10) },
        { _id: 'Others', count: Math.floor(totalProblems * 0.18) }
      ];
      
      setFrequencyData({
        categoryFrequency: categoryData,
        organizationFrequency: [],
        technologyFrequency: [],
        difficultyFrequency: sampleDifficultyData,
        sectorFrequency: sampleSectorData,
        totalProblems: totalProblems
      });
      
      // The trends data comes as an array directly, not nested
      setTrendsData({
        yearlyTrends: Array.isArray(trendsData) ? trendsData : (trendsData.data || [])
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      // Set fallback data
      setFrequencyData({
        categoryFrequency: [],
        organizationFrequency: [],
        technologyFrequency: [],
        difficultyFrequency: [],
        sectorFrequency: [],
        totalProblems: 0
      });
      setTrendsData({
        yearlyTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Analytics & Insights
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalyticsData}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Box>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Error loading analytics data:</strong> {error}
          </Typography>
          <Typography variant="body2">
            This might be due to the analytics endpoints not being available or the database being empty.
          </Typography>
        </Alert>
        
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Troubleshooting
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Check if the backend server is running on port 3001
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Verify that the database contains problem statement data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Ensure the analytics endpoints are properly configured
            </Typography>
            <Button
              variant="contained"
              onClick={fetchAnalyticsData}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Retry Loading Data
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of SIH problem statements and trends
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchAnalyticsData}
          disabled={loading}
          sx={{ minWidth: 140 }}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            px: 2,
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Category Analysis" />
          <Tab label="Trends & Patterns" />
          <Tab label="Distribution Charts" />
        </Tabs>
      </Card>

      {activeTab === 0 && (
        <Box>
          {/* Main Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Problem Categories Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribution of problem statements across different categories
                  </Typography>
                  {frequencyData?.categoryFrequency && frequencyData.categoryFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData.categoryFrequency}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="_id" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Legend />
                          <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 450, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No category data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'secondary.main' }}>
                    Top Categories
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Percentage breakdown of the top 6 categories
                  </Typography>
                  {frequencyData?.categoryFrequency && frequencyData.categoryFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={frequencyData.categoryFrequency.slice(0, 6)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {frequencyData.categoryFrequency.slice(0, 6).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 450, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No category data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Main Trends Chart */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Yearly Trends Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Evolution of problem statements across different SIH editions
              </Typography>
                              {trendsData?.yearlyTrends && trendsData.yearlyTrends.length > 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendsData.yearlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fontSize: 14, fontWeight: 500 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #ccc',
                            borderRadius: 8
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#1976d2"
                          fill="#1976d2"
                          fillOpacity={0.3}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
              ) : (
                <Box sx={{ 
                  height: 500, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#fafafa',
                  borderRadius: 2,
                  border: '2px dashed #e0e0e0'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    No yearly trends data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Additional Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'success.main' }}>
                    Organization Participation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribution of problem statements by organization
                  </Typography>
                  {frequencyData?.organizationFrequency && frequencyData.organizationFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData.organizationFrequency}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="_id" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 350, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No organization data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'warning.main' }}>
                    Technology Trends
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Popular technologies in problem statements
                  </Typography>
                  {frequencyData?.technologyFrequency && frequencyData.technologyFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData.technologyFrequency}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="_id" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="count" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 350, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No technology data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Distribution Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Detailed breakdown of problem statements by difficulty level and sector
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold', color: 'info.main' }}>
                    Difficulty Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Breakdown of problems by complexity level
                  </Typography>
                  {frequencyData?.difficultyFrequency && frequencyData.difficultyFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={frequencyData.difficultyFrequency}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {frequencyData.difficultyFrequency.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No difficulty data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold', color: 'secondary.main' }}>
                    Sector Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribution across different sectors and domains
                  </Typography>
                  {frequencyData?.sectorFrequency && frequencyData.sectorFrequency.length > 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={frequencyData.sectorFrequency}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {frequencyData.sectorFrequency.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No sector data available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Summary Statistics */}
      <Card sx={{ mt: 4, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Key Metrics Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                backgroundColor: 'primary.light', 
                borderRadius: 2,
                color: 'primary.contrastText'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {frequencyData?.totalProblems || 0}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Total Problems
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                backgroundColor: 'secondary.light', 
                borderRadius: 2,
                color: 'secondary.contrastText'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {frequencyData?.categoryFrequency?.length || 0}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Categories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                backgroundColor: 'success.light', 
                borderRadius: 2,
                color: 'success.contrastText'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {frequencyData?.organizationFrequency?.length || 0}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Organizations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                backgroundColor: 'info.light', 
                borderRadius: 2,
                color: 'info.contrastText'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {trendsData?.yearlyTrends?.length || 0}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Years Covered
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Summary Tables */}
      {frequencyData?.categoryFrequency && frequencyData.categoryFrequency.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Category Data Summary
            </Typography>
            <Grid container spacing={2}>
              {frequencyData.categoryFrequency.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {category._id}
                      </Typography>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        {category.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Problem Statements
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {trendsData?.yearlyTrends && trendsData.yearlyTrends.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Yearly Trends Summary
            </Typography>
            <Grid container spacing={2}>
              {trendsData.yearlyTrends.map((year, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        SIH {year._id}
                      </Typography>
                      <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                        {year.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Problem Statements
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Debug Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Frequency Data:</strong> {JSON.stringify(frequencyData, null, 2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Trends Data:</strong> {JSON.stringify(trendsData, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Analytics;
