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
} from '@mui/material';
import {
  Download as DownloadIcon,
  FileDownload as FileDownloadIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

function Exports() {
  const [exportFiles, setExportFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchExportFiles();
  }, []);

  const fetchExportFiles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getExportFiles();
      setExportFiles(data.data || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportByCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      setExporting(true);
      const result = await apiService.exportByCategory(selectedCategory);
      if (result.success) {
        // Trigger download
        const downloadUrl = apiService.getDownloadUrl(result.filename);
        window.open(downloadUrl, '_blank');
        await fetchExportFiles(); // Refresh file list
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportByYear = async () => {
    if (!selectedYear) return;
    
    try {
      setExporting(true);
      const result = await apiService.exportByYear(selectedYear);
      if (result.success) {
        // Trigger download
        const downloadUrl = apiService.getDownloadUrl(result.filename);
        window.open(downloadUrl, '_blank');
        await fetchExportFiles(); // Refresh file list
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setExporting(true);
      const result = await apiService.exportAll();
      if (result.success) {
        // Trigger download
        const downloadUrl = apiService.getDownloadUrl(result.filename);
        window.open(downloadUrl, '_blank');
        await fetchExportFiles(); // Refresh file list
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Data Exports
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchExportFiles}
          disabled={loading}
        >
          Refresh Files
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Export Options */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Export by Category
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Select Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Agriculture">Agriculture</MenuItem>
                  <MenuItem value="Environment">Environment</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Energy">Energy</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Water & Sanitation">Water & Sanitation</MenuItem>
                  <MenuItem value="Rural Development">Rural Development</MenuItem>
                  <MenuItem value="Urban Development">Urban Development</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CategoryIcon />}
                onClick={handleExportByCategory}
                disabled={!selectedCategory || exporting}
              >
                Export Category
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Export by Year
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
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
                startIcon={<CalendarIcon />}
                onClick={handleExportByYear}
                disabled={!selectedYear || exporting}
              >
                Export Year
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Export All Data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Download complete dataset with all problem statements
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<StorageIcon />}
                onClick={handleExportAll}
                disabled={exporting}
              >
                Export All Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Progress */}
      {exporting && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Exporting data... Please wait while we prepare your file.
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
        </Alert>
      )}

      {/* Available Files */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Available Export Files
          </Typography>
          
          {exportFiles.length === 0 ? (
            <Alert severity="info">
              No export files available. Use the export options above to generate files.
            </Alert>
          ) : (
            <List>
              {exportFiles.map((file, index) => (
                <React.Fragment key={file.filename}>
                  <ListItem>
                    <ListItemIcon>
                      <FileDownloadIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.filename}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Size: {formatFileSize(file.size)} • Created: {formatDate(file.created)}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`${file.size} bytes`}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={formatDate(file.modified)}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const downloadUrl = apiService.getDownloadUrl(file.filename);
                        window.open(downloadUrl, '_blank');
                      }}
                    >
                      Download
                    </Button>
                  </ListItem>
                  {index < exportFiles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Export Directory Info */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="body2">
            <strong>Export Directory:</strong> Files are saved to the server's export directory and can be downloaded directly.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

export default Exports;
