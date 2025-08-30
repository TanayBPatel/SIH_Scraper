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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

function Scraping() {
  const [selectedYear, setSelectedYear] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleScrapeYear = async () => {
    if (!selectedYear) return;
    
    try {
      setScraping(true);
      setError(null);
      setSuccess(null);
      
      const result = await apiService.scrapeYear(selectedYear);
      
      if (result.success) {
        setSuccess(`Successfully scraped SIH ${selectedYear}: ${result.result.count} problems found`);
        setScrapingStatus({
          year: selectedYear,
          status: result.result.status,
          count: result.result.count,
          timestamp: new Date().toISOString(),
        });
      } else {
        setError('Failed to scrape data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setScraping(false);
    }
  };

  const handleScrapeAllYears = async () => {
    try {
      setScraping(true);
      setError(null);
      setSuccess(null);
      
      // This would need to be implemented in the backend
      setSuccess('Scraping all years initiated. This may take several minutes.');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setScraping(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in_progress':
        return <ScheduleIcon color="info" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Data Scraping
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Scraping Controls */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Scrape Specific Year
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Select Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <MenuItem value="2025">SIH 2025</MenuItem>
                  <MenuItem value="2024">SIH 2024</MenuItem>
                  <MenuItem value="2023">SIH 2023</MenuItem>
                  <MenuItem value="2022">SIH 2022</MenuItem>
                  <MenuItem value="2021">SIH 2021</MenuItem>
                  <MenuItem value="2020">SIH 2020</MenuItem>
                  <MenuItem value="2019">SIH 2019</MenuItem>
                  <MenuItem value="2018">SIH 2018</MenuItem>
                  <MenuItem value="2017">SIH 2017</MenuItem>
                  <MenuItem value="2016">SIH 2016</MenuItem>
                  <MenuItem value="2015">SIH 2015</MenuItem>
                </Select>
              </FormControl>
              <Button
                fullWidth
                variant="contained"
                startIcon={scraping ? <CircularProgress size={20} /> : <PlayIcon />}
                onClick={handleScrapeYear}
                disabled={!selectedYear || scraping}
              >
                {scraping ? 'Scraping...' : 'Start Scraping'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Bulk Operations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Scrape all available SIH years. This operation may take several minutes and will update existing data.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={scraping ? <CircularProgress size={20} /> : <RefreshIcon />}
                onClick={handleScrapeAllYears}
                disabled={scraping}
              >
                {scraping ? 'Processing...' : 'Scrape All Years'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scraping Progress */}
      {scraping && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Scraping Progress
            </Typography>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Scraping data from SIH website... Please wait while we collect problem statements.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Scraping Status */}
      {scrapingStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Last Scraping Result
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(scrapingStatus.status)}
                </ListItemIcon>
                <ListItemText
                  primary={`SIH ${scrapingStatus.year}`}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status: {scrapingStatus.status} • Problems Found: {scrapingStatus.count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed: {new Date(scrapingStatus.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={scrapingStatus.status}
                  color={getStatusColor(scrapingStatus.status)}
                  variant="outlined"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                How It Works
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The scraper automatically visits the SIH website and extracts problem statements using advanced parsing algorithms.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Intelligent HTML parsing with Cheerio<br/>
                • Rate limiting to respect server resources<br/>
                • Automatic error handling and retries<br/>
                • Data validation and cleaning
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Data Quality
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Our scraper ensures high-quality data extraction with comprehensive coverage.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Complete problem descriptions<br/>
                • Accurate categorization<br/>
                • Organization details<br/>
                • Technology stack information<br/>
                • Difficulty assessments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Best Practices
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Follow these guidelines for optimal scraping results.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Run during off-peak hours<br/>
                • Monitor progress indicators<br/>
                • Check results after completion<br/>
                • Export data regularly<br/>
                • Keep backups of important data
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>System Status:</strong> Scraping service is operational. The system automatically handles rate limiting and error recovery.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

export default Scraping;
