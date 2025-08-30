import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Lightbulb as InsightIcon,
  TrendingUp as TrendIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const predefinedQueries = [
  "Analyze the most common problem categories and their trends",
  "What are the key technology trends in SIH problem statements?",
  "Identify patterns in organization participation across years",
  "Analyze the difficulty distribution and complexity patterns",
  "What insights can you provide about healthcare-related problems?",
  "How have problem statements evolved over the years?",
  "Identify emerging trends in rural development problems",
  "Analyze the relationship between problem categories and organizations",
];

function AIAnalysis() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleQuery = async (customQuery = null) => {
    const queryToSend = customQuery || query;
    if (!queryToSend.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.queryGemini(queryToSend);
      
      if (result.success) {
        const newAnalysis = {
          query: queryToSend,
          response: result.response,
          timestamp: new Date().toISOString(),
        };
        
        setAnalysis(newAnalysis);
        setChatHistory(prev => [...prev, newAnalysis]);
        
        if (!customQuery) {
          setQuery('');
        }
      } else {
        setError('Failed to get AI analysis');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePredefinedQuery = (predefinedQuery) => {
    setQuery(predefinedQuery);
    handleQuery(predefinedQuery);
  };

  const formatResponse = (response) => {
    // Simple formatting for the AI response
    return response.split('\n').map((line, index) => (
      <Typography key={index} variant="body1" sx={{ mb: 1 }}>
        {line}
      </Typography>
    ));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        AI-Powered Analysis
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Leverage the power of Google Gemini AI to gain intelligent insights from your SIH problem statement data.
        Ask questions, discover patterns, and uncover hidden trends in your dataset.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Query Input */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ask Your Question
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Enter your question or analysis request"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Analyze the most common problem categories and their trends over the years..."
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <LinearProgress /> : <SendIcon />}
                onClick={() => handleQuery()}
                disabled={!query.trim() || loading}
                sx={{ height: '100%' }}
              >
                {loading ? 'Analyzing...' : 'Ask AI'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Predefined Queries */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Quick Analysis Templates
          </Typography>
          <Grid container spacing={2}>
            {predefinedQueries.map((predefinedQuery, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handlePredefinedQuery(predefinedQuery)}
                  disabled={loading}
                  sx={{ 
                    textAlign: 'left', 
                    justifyContent: 'flex-start',
                    height: 'auto',
                    p: 2,
                    whiteSpace: 'normal',
                    lineHeight: 1.4,
                  }}
                >
                  <Typography variant="body2">
                    {predefinedQuery}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Current Analysis */}
      {analysis && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AIIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                AI Analysis Result
              </Typography>
            </Box>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3, backgroundColor: '#fafafa' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Question:</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                "{analysis.query}"
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>AI Response:</strong>
              </Typography>
              <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
                {formatResponse(analysis.response)}
              </Box>
            </Paper>
            
            <Typography variant="caption" color="text.secondary">
              Analysis completed at {new Date(analysis.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Analysis History
            </Typography>
            <List>
              {chatHistory.slice(-5).reverse().map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <AIIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {item.query}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.response.substring(0, 150)}...
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      onClick={() => setAnalysis(item)}
                    >
                      View Full
                    </Button>
                  </ListItem>
                  {index < chatHistory.slice(-5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* AI Capabilities Info */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InsightIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    Pattern Recognition
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  AI identifies hidden patterns, correlations, and trends in your data that might not be immediately obvious.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    Trend Analysis
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Understand how problem statements, categories, and technologies have evolved over different SIH editions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PsychologyIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    Intelligent Insights
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get contextual insights and recommendations based on comprehensive analysis of your entire dataset.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* System Status */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>AI Service Status:</strong> Google Gemini AI integration is active and ready to analyze your SIH data.
            Each query processes the entire dataset to provide comprehensive insights.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

export default AIAnalysis;
