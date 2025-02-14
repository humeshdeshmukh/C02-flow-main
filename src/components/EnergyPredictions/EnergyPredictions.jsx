import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

const EnergyPredictions = ({ selectedState, data }) => {
  if (!data) {
    return (
      <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        Select a state to view AI-driven energy predictions
      </Box>
    );
  }

  const predictions = {
    demandTrend: Math.random() > 0.5 ? 'up' : 'down',
    demandChange: Math.floor(Math.random() * 15),
    peakHours: ['14:00', '19:00'],
    renewableContribution: Math.floor(Math.random() * 20) + 20,
    efficiencyScore: Math.floor(Math.random() * 30) + 70,
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#FFD180', mb: 3 }}>
        AI-Driven Energy Predictions {selectedState ? `for ${selectedState}` : ''}
      </Typography>
      <Grid container spacing={3}>
        {/* Demand Trend */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(38, 38, 38, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 183, 77, 0.1)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Predicted Demand Trend
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {predictions.demandTrend === 'up' ? (
                <TrendingUpIcon sx={{ color: '#E57373' }} />
              ) : (
                <TrendingDownIcon sx={{ color: '#81C784' }} />
              )}
              <Typography
                variant="h6"
                sx={{ color: predictions.demandTrend === 'up' ? '#E57373' : '#81C784' }}
              >
                {predictions.demandChange}% {predictions.demandTrend === 'up' ? 'Increase' : 'Decrease'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(38, 38, 38, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 183, 77, 0.1)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Predicted Peak Hours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ElectricBoltIcon sx={{ color: '#FFB74D' }} />
              <Typography variant="h6" sx={{ color: '#FFB74D' }}>
                {predictions.peakHours.join(' & ')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Renewable Contribution */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(38, 38, 38, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 183, 77, 0.1)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Predicted Renewable Contribution
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ color: '#4DB6AC' }}>
                {predictions.renewableContribution}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnergyPredictions;
