import React from 'react';
import { Paper, Typography, Box, Grid, LinearProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const DynamicLoadBalancing = ({ data, error }) => {
  if (error) {
    return (
      <Typography variant="body1" color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!data || !Array.isArray(data)) {
    return (
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', p: 2 }}>
        Loading load balancing data...
      </Typography>
    );
  }

  const getLoadColor = (load) => {
    if (load >= 90) return '#E57373'; // High load - Red
    if (load >= 70) return '#FFB74D'; // Medium load - Orange
    return '#81C784'; // Low load - Green
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#E57373';
      case 'medium':
        return '#FFB74D';
      default:
        return '#81C784';
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {data.map((region, index) => (
          <Grid item xs={12} key={region.region || index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(38, 38, 38, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D' }}>
                    {region.region}
                  </Typography>
                  <Chip
                    label={region.priority}
                    size="small"
                    sx={{
                      backgroundColor: `${getPriorityColor(region.priority)}20`,
                      color: getPriorityColor(region.priority),
                      border: `1px solid ${getPriorityColor(region.priority)}40`,
                    }}
                  />
                </Box>

                {/* Current Load */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Current Load
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={region.currentLoad}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getLoadColor(region.currentLoad),
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: getLoadColor(region.currentLoad), minWidth: 50 }}>
                      {Math.round(region.currentLoad)}%
                    </Typography>
                  </Box>
                </Box>

                {/* Action and Grid Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Action: {region.action}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Grid Stability: {region.gridStability}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Weather: {region.weather}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DynamicLoadBalancing;
