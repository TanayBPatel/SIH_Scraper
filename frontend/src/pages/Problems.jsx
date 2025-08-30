import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Pagination,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { apiService } from '../services/apiService';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    renderCell: (params) => (
      <Chip label={params.value} size="small" color="primary" />
    ),
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {params.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {params.row.organizationName}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color="secondary"
        variant="outlined"
      />
    ),
  },
  {
    field: 'year',
    headerName: 'Year',
    width: 100,
    renderCell: (params) => (
      <Chip label={`SIH ${params.value}`} size="small" color="info" />
    ),
  },
  {
    field: 'difficulty',
    headerName: 'Difficulty',
    width: 120,
    renderCell: (params) => {
      const color = params.value === 'Easy' ? 'success' : 
                   params.value === 'Medium' ? 'warning' : 'error';
      return (
        <Chip label={params.value} size="small" color={color} />
      );
    },
  },
  {
    field: 'technology',
    headerName: 'Technologies',
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {params.value?.slice(0, 3).map((tech, index) => (
          <Chip key={index} label={tech} size="small" variant="outlined" />
        ))}
        {params.value?.length > 3 && (
          <Chip label={`+${params.value.length - 3}`} size="small" />
        )}
      </Box>
    ),
  },
];

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    category: '',
    organization: '',
  });

  useEffect(() => {
    fetchProblems();
  }, [pagination.page, pagination.limit, filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      
      const data = await apiService.getProblems(params);
      setProblems(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      year: '',
      category: '',
      organization: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Problem Statements
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Problems"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                placeholder="Search by title or description..."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <MenuItem value="">All Years</MenuItem>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(year => (
                    <MenuItem key={year} value={year}>SIH {year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
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
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={filters.organization}
                  label="Organization"
                  onChange={(e) => handleFilterChange('organization', e.target.value)}
                >
                  <MenuItem value="">All Organizations</MenuItem>
                  <MenuItem value="Government of India">Government of India</MenuItem>
                  <MenuItem value="Ministry">Ministry</MenuItem>
                  <MenuItem value="Department">Department</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={fetchProblems}
                  disabled={loading}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  color="secondary"
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {problems.length} of {pagination.total} problems
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => apiService.exportAll()}
          disabled={loading}
        >
          Export All
        </Button>
      </Box>

      {/* Data Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={problems}
              columns={columns}
              loading={loading}
              pagination={false}
              hideFooterPagination
              hideFooter
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#fafafa',
                  borderBottom: '2px solid #e0e0e0',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(pagination.total / pagination.limit)}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}

export default Problems;
