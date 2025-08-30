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
} from '@mui/material';
import {
  TrendingUp,
  Category,
  Business,
  CalendarToday,
  CheckCircle,
  Warning,
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Problems"
            value={stats?.totalProblems || 0}
            icon={<TrendingUp />}
            color="primary"
            subtitle="Problem statements collected"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats?.categoryStats?.length || 0}
            icon={<Category />}
            color="secondary"
            subtitle="Different problem categories"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Organizations"
            value={stats?.organizationStats?.length || 0}
            icon={<Business />}
            color="success"
            subtitle="Participating organizations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Years Covered"
            value={stats?.yearStats?.length || 0}
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
              {stats?.categoryStats?.slice(0, 5).map((category, index) => (
                <Box key={category.category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {category.category}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {category.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.count / stats.totalProblems) * 100}
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
              {stats?.yearStats?.slice(0, 5).map((year) => (
                <Box key={year.year} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      SIH {year.year}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {year.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(year.count / stats.totalProblems) * 100}
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
            {stats?.totalProblems || 0} problem statements across multiple SIH editions.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

export default Dashboard;
