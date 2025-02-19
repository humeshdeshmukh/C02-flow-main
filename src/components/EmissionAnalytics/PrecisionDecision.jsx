import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const PrecisionDecision = ({ predictions }) => {
  if (!predictions) return null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FFC107';
    return '#F44336';
  };

  const getTrendIcon = (current, future) => {
    const percentChange = ((future - current) / current) * 100;
    if (percentChange > 5) {
      return <TrendingUpIcon sx={{ color: '#F44336' }} />;
    } else if (percentChange < -5) {
      return <TrendingDownIcon sx={{ color: '#4CAF50' }} />;
    }
    return <TrendingFlatIcon sx={{ color: '#FFC107' }} />;
  };

  const analyzeTrend = (sector, current, prediction) => {
    const percentChange = ((prediction - current) / current) * 100;
    let recommendation = '';
    let color = '';

    if (percentChange > 10) {
      recommendation = 'Critical attention needed';
      color = '#F44336';
    } else if (percentChange > 5) {
      recommendation = 'Monitor closely';
      color = '#FFC107';
    } else {
      recommendation = 'On track';
      color = '#4CAF50';
    }

    return { percentChange, recommendation, color };
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
        Precision Analysis
      </Typography>

      {/* Model Confidence */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#FFB74D', mb: 1 }}>
          Model Confidence Score
        </Typography>
        <Tooltip title={`${(predictions.confidenceScore * 100).toFixed(1)}% confidence`}>
          <LinearProgress
            variant="determinate"
            value={predictions.confidenceScore * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getConfidenceColor(predictions.confidenceScore),
              },
            }}
          />
        </Tooltip>
      </Box>

      {/* Sector Analysis */}
      {Object.entries(predictions.predictions.fiveYears).map(([sector, value]) => {
        if (sector === 'confidence') return null;
        const currentValue = sector === 'total' ? 
          predictions.currentData?.total : 
          predictions.currentData?.[sector] || 0;
        
        const trend = analyzeTrend(sector, currentValue, value);

        return (
          <Box key={sector} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#FFB74D',
                  textTransform: 'capitalize',
                  flex: 1 
                }}
              >
                {sector}
              </Typography>
              {getTrendIcon(currentValue, value)}
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend.color,
                display: 'block',
                mb: 0.5 
              }}
            >
              {trend.recommendation} ({trend.percentChange > 0 ? '+' : ''}{trend.percentChange.toFixed(1)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (value / currentValue) * 100)}
              sx={{
                height: 4,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: trend.color,
                },
              }}
            />
          </Box>
        );
      })}

      {/* Key Factors Impact */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#FFB74D', mb: 1 }}>
          Key Factors Impact
        </Typography>
        {predictions.keyFactors.map((factor, index) => (
          <Tooltip key={index} title={factor}>
            <Box sx={{ 
              mb: 1,
              p: 1,
              borderRadius: 1,
              backgroundColor: 'rgba(255,183,77,0.1)',
              border: '1px solid rgba(255,183,77,0.2)',
              cursor: 'help'
            }}>
              <Typography variant="caption" sx={{ color: '#FFB74D' }}>
                {factor}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default PrecisionDecision;
