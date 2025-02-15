import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import IndiaMap from './IndiaMap/IndiaMap';
import BeeTrail from './BeeTrail';
import { soundManager } from './SoundEffects';
import { swarmApi } from '../services/apiService';
import { useSwarm } from '../context/SwarmContext';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import geminiService from '../services/geminiService';
import PrecisionDecision from './EmissionAnalytics/PrecisionDecision';
import ShegaonMap from './ShegaonMap';

// State carbon footprint data
const stateCarbonData = {
  'Andhra Pradesh': { total: 45000, industrial: 25000, residential: 15000, transport: 5000 },
  'Arunachal Pradesh': { total: 2000, industrial: 800, residential: 1000, transport: 200 },
  'Assam': { total: 15000, industrial: 8000, residential: 5000, transport: 2000 },
  'Bihar': { total: 30000, industrial: 15000, residential: 10000, transport: 5000 },
  'Chhattisgarh': { total: 40000, industrial: 25000, residential: 10000, transport: 5000 },
  'Goa': { total: 5000, industrial: 2500, residential: 1500, transport: 1000 },
  'Gujarat': { total: 80000, industrial: 50000, residential: 20000, transport: 10000 },
  'Haryana': { total: 35000, industrial: 20000, residential: 10000, transport: 5000 },
  'Himachal Pradesh': { total: 8000, industrial: 4000, residential: 3000, transport: 1000 },
  'Karnataka': { total: 60000, industrial: 35000, residential: 15000, transport: 10000 },
  'Kerala': { total: 25000, industrial: 12000, residential: 8000, transport: 5000 },
  'Madhya Pradesh': { total: 50000, industrial: 30000, residential: 15000, transport: 5000 },
  'Maharashtra': { total: 100000, industrial: 60000, residential: 25000, transport: 15000 },
  'Manipur': { total: 3000, industrial: 1000, residential: 1500, transport: 500 },
  'Meghalaya': { total: 4000, industrial: 2000, residential: 1500, transport: 500 },
  'Mizoram': { total: 2000, industrial: 800, residential: 900, transport: 300 },
  'Nagaland': { total: 2500, industrial: 1000, residential: 1000, transport: 500 },
  'Odisha': { total: 45000, industrial: 30000, residential: 10000, transport: 5000 },
  'Punjab': { total: 40000, industrial: 25000, residential: 10000, transport: 5000 },
  'Rajasthan': { total: 55000, industrial: 35000, residential: 15000, transport: 5000 },
  'Sikkim': { total: 2000, industrial: 800, residential: 900, transport: 300 },
  'Tamil Nadu': { total: 75000, industrial: 45000, residential: 20000, transport: 10000 },
  'Telangana': { total: 50000, industrial: 30000, residential: 15000, transport: 5000 },
  'Tripura': { total: 4000, industrial: 2000, residential: 1500, transport: 500 },
  'Uttar Pradesh': { total: 90000, industrial: 50000, residential: 30000, transport: 10000 },
  'Uttarakhand': { total: 12000, industrial: 6000, residential: 4000, transport: 2000 },
  'West Bengal': { total: 65000, industrial: 40000, residential: 20000, transport: 5000 },
  'Delhi': { total: 45000, industrial: 20000, residential: 15000, transport: 10000 }
};

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const { swarmState } = useSwarm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStateSelect = async (state) => {
    setSelectedState(state);
    const stateData = stateCarbonData[state] || {
      total: 0,
      industrial: 0,
      residential: 0,
      transport: 0
    };
    setCarbonData(stateData);

    // Get predictions using Gemini
    setIsPredicting(true);
    try {
      const predictionData = await geminiService.predictCarbonEmissions(stateData);
      setPredictions(predictionData);
    } catch (error) {
      console.error('Error getting predictions:', error);
    }
    setIsPredicting(false);
  };

  const renderPredictions = () => {
    if (!predictions) return null;

    return (
      <>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
            Future Predictions
          </Typography>
          
          {Object.entries(predictions.predictions).map(([period, data]) => (
            <Box key={period} sx={{ mb: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ color: '#FFB74D', mb: 1 }}>
                {period.replace(/([A-Z])/g, ' $1').toLowerCase()}: 
                <Chip 
                  size="small" 
                  label={`${(data.confidence * 100).toFixed(0)}% confidence`}
                  sx={{ ml: 1, backgroundColor: data.confidence > 0.8 ? '#4CAF50' : data.confidence > 0.6 ? '#FFC107' : '#F44336' }}
                />
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', mb: 0.5 }}>
                Total: {data.total.toLocaleString()} tCO₂e
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                Industrial: {data.industrial.toLocaleString()} | 
                Residential: {data.residential.toLocaleString()} | 
                Transport: {data.transport.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>

        <PrecisionDecision 
          predictions={{
            ...predictions,
            currentData: carbonData
          }} 
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#FFD180', mb: 1 }}>
            Key Recommendations
          </Typography>
          {predictions.recommendations.map((rec, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                <Chip 
                  size="small" 
                  label={rec.priority}
                  sx={{ 
                    mr: 1,
                    backgroundColor: 
                      rec.priority === 'high' ? '#F44336' : 
                      rec.priority === 'medium' ? '#FFC107' : '#4CAF50'
                  }}
                />
                {rec.sector}: {rec.action}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Impact: {rec.impact}
              </Typography>
            </Box>
          ))}
        </Box>
      </>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.2)',
                }}
              >
                <Typography variant="h4" sx={{ color: '#FFB74D', mb: 2 }}>
                  Carbon Footprint Dashboard
                </Typography>
              </Paper>  
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} container spacing={3}>
              {/* Left Column - Map */}
              <Grid item xs={12} md={7} lg={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '600px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
                    State-wise Carbon Footprint Map
                  </Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative', height: '100%' }}>
                    <IndiaMap onStateSelect={handleStateSelect} />
                    <BeeTrail />
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column - Details */}
              <Grid item xs={12} md={5} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '600px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                  }}
                >
                  {selectedState ? (
                    <>
                      <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
                        {selectedState} Carbon Footprint Details
                      </Typography>
                      {carbonData && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                            Total Emissions: {carbonData.total.toLocaleString()} tCO₂e
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Industrial: {carbonData.industrial.toLocaleString()} tCO₂e
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Residential: {carbonData.residential.toLocaleString()} tCO₂e
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Transport: {carbonData.transport.toLocaleString()} tCO₂e
                          </Typography>
                        </Box>
                      )}
                      {isPredicting ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        renderPredictions()
                      )}
                    </>
                  ) : (
                    <Typography sx={{ color: '#fff' }}>
                      Select a state to view its carbon footprint details
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Shegaon Map Section */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
                    Shegaon Campus Map
                  </Typography>
                  <ShegaonMap />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}

export default Dashboard;
