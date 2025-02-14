import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, LinearProgress, Paper, Divider, Chip } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import geminiService from '../../services/geminiService';

const EnergyConsumptionOverview = ({ data }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAiInsights = async () => {
      if (!data) return;
      
      setLoading(true);
      setError(null);
      try {
        const stateData = {
          name: data.state || 'Unknown State',
          totalGeneration: data.generation || 0,
          renewablePercentage: data.renewableShare || 0,
          gridStability: 95,
          energyStorage: Math.floor((data.total || 0) * 0.1),
          carbonFootprint: Math.floor((data.consumption || 0) * 0.7)
        };

        console.log('Fetching AI insights for state:', stateData);
        const insights = await geminiService.getStateEnergyOverview(stateData);
        console.log('Received AI insights:', insights);
        setAiInsights(insights);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAiInsights();
  }, [data]);

  if (!data) {
    return (
      <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        Select a state to view energy consumption details
      </Box>
    );
  }

  const calculatePercentage = (value, total) => ((value || 0) / (total || 1)) * 100;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Consumption vs Generation */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Consumption vs Generation
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculatePercentage(data.consumption, data.total)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#FFB74D',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#FFB74D', minWidth: 50 }}>
              {data.consumption || 0} MW
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculatePercentage(data.generation, data.total)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#81C784',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#81C784', minWidth: 50 }}>
              {data.generation || 0} MW
            </Typography>
          </Box>
        </Grid>

        {/* Peak Load */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Peak Load
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculatePercentage(data.peak, data.total)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#E57373',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#E57373', minWidth: 50 }}>
              {data.peak || 0} MW
            </Typography>
          </Box>
        </Grid>

        {/* Base Load */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Base Load
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculatePercentage(data.base, data.total)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#64B5F6',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64B5F6', minWidth: 50 }}>
              {data.base || 0} MW
            </Typography>
          </Box>
        </Grid>

        {/* Renewable Share */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Renewable Share
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={data.renewableShare || 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4DB6AC',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#4DB6AC', minWidth: 50 }}>
              {data.renewableShare || 0}%
            </Typography>
          </Box>
        </Grid>

        {/* AI Insights Section */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 183, 77, 0.2)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TipsAndUpdatesIcon sx={{ color: '#FFB74D' }} />
            <Typography variant="h6" sx={{ color: '#FFB74D' }}>
              AI Insights
            </Typography>
          </Box>
          
          {loading ? (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Analyzing energy data...
            </Typography>
          ) : error ? (
            <Typography sx={{ color: '#E57373' }}>
              {error.includes('API key') ? (
                <>
                  AI insights are currently unavailable. Please configure your Gemini API key in the .env file:
                  <Box component="pre" sx={{ mt: 1, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, fontSize: '0.875rem' }}>
                    REACT_APP_GEMINI_API_KEY=your_api_key_here
                  </Box>
                </>
              ) : (
                `Error: ${error}`
              )}
            </Typography>
          ) : aiInsights ? (
            <Grid container spacing={2}>
              {/* Energy Mix Distribution */}
              <Grid item xs={12}>
                <Paper sx={{
                  p: 2,
                  background: 'rgba(38, 38, 38, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.1)',
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFB74D', mb: 1 }}>
                    Energy Mix Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(aiInsights.energyMixDistribution || {}).map(([source, percentage]) => (
                      <Chip
                        key={source}
                        label={`${source}: ${percentage}%`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 183, 77, 0.1)',
                          color: '#FFB74D',
                          border: '1px solid rgba(255, 183, 77, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Sustainability Indicators */}
              <Grid item xs={12}>
                <Paper sx={{
                  p: 2,
                  background: 'rgba(38, 38, 38, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.1)',
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#4DB6AC', mb: 1 }}>
                    Sustainability Insights
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(aiInsights.sustainabilityIndicators || {}).map(([indicator, value]) => (
                      <Typography key={indicator} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {indicator}: {value}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Future Projections */}
              <Grid item xs={12}>
                <Paper sx={{
                  p: 2,
                  background: 'rgba(38, 38, 38, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.1)',
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#81C784', mb: 1 }}>
                    Future Energy Projections
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(aiInsights.futureEnergyProjections || {}).map(([projection, value]) => (
                      <Typography key={projection} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {projection}: {value}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Select a state to view AI insights
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnergyConsumptionOverview;
