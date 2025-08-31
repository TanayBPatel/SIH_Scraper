import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Category,
  Business,
  CalendarToday,
  CheckCircle,
  Warning,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            borderRadius: 2,
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching stats...');
      const data = await apiService.getStats();
      console.log('Stats received:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard Overview
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchStats}
          disabled={loading}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Dashboard Overview
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchStats}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Problems"
            value={stats?.data?.totalProblems || stats?.totalProblems || 0}
            icon={<TrendingUp />}
            color="primary"
            subtitle="Problem statements collected"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats?.data?.categoryStats?.length || stats?.categoryStats?.length || 0}
            icon={<Category />}
            color="secondary"
            subtitle="Different problem categories"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Organizations"
            value={stats?.data?.organizationStats?.length || stats?.organizationStats?.length || 0}
            icon={<Business />}
            color="success"
            subtitle="Participating organizations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Years Covered"
            value={stats?.data?.yearStats?.length || stats?.yearStats?.length || 0}
            icon={<CalendarToday />}
            color="info"
            subtitle="SIH editions included"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Top Categories
              </Typography>
              {(stats?.data?.categoryStats || stats?.categoryStats || []).slice(0, 5).map((category, index) => (
                <Box key={category._id || category.category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {category._id || category.category}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {category.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.count / (stats?.data?.totalProblems || stats?.totalProblems || 1)) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Yearly Distribution
              </Typography>
              {(stats?.data?.yearStats || stats?.yearStats || []).slice(0, 5).map((year) => (
                <Box key={year._id || year.year} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      SIH {year._id || year.year}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {year.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(year.count / (stats?.data?.totalProblems || stats?.totalProblems || 1)) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info" icon={<CheckCircle />}>
          <Typography variant="body2">
            <strong>System Status:</strong> All endpoints are operational. Database contains{' '}
            {stats?.data?.totalProblems || stats?.totalProblems || 0} problem statements across multiple SIH editions.
          </Typography>
        </Alert>
      </Box>

      {/* Debug section - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Debug Info (Development Only)
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {JSON.stringify(stats, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Dashboard;
