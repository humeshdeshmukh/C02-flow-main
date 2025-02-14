import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import IndiaMap from './IndiaMap/IndiaMap';
import HistoricalData from './HistoricalData/HistoricalData';
import BeeTrail from './BeeTrail';
import { soundManager } from './SoundEffects';
import { swarmApi } from '../services/apiService';
import { useSwarm } from '../context/SwarmContext';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import DynamicLoadBalancing from './DynamicLoadBalancing/DynamicLoadBalancing';
import EnergyConsumptionOverview from './EnergyConsumptionOverview/EnergyConsumptionOverview';
import EnergyPredictions from './EnergyPredictions/EnergyPredictions';
import geminiService from '../services/geminiService';

// Comprehensive state energy data
const stateEnergyData = {
  'Andhra Pradesh': {
    consumption: 5200,
    generation: 4980,
    total: 6500,
    peak: 5800,
    base: 2200,
    renewableShare: 28
  },
  'Arunachal Pradesh': {
    consumption: 180,
    generation: 150,
    total: 250,
    peak: 200,
    base: 80,
    renewableShare: 35
  },
  'Assam': {
    consumption: 1800,
    generation: 1650,
    total: 2200,
    peak: 2000,
    base: 800,
    renewableShare: 20
  },
  'Bihar': {
    consumption: 3200,
    generation: 2800,
    total: 4000,
    peak: 3500,
    base: 1500,
    renewableShare: 15
  },
  'Chhattisgarh': {
    consumption: 2800,
    generation: 3200,
    total: 3500,
    peak: 3000,
    base: 1200,
    renewableShare: 22
  },
  'Goa': {
    consumption: 650,
    generation: 550,
    total: 800,
    peak: 700,
    base: 300,
    renewableShare: 25
  },
  'Gujarat': {
    consumption: 8500,
    generation: 9200,
    total: 10000,
    peak: 9000,
    base: 3500,
    renewableShare: 40
  },
  'Haryana': {
    consumption: 4200,
    generation: 3800,
    total: 5000,
    peak: 4500,
    base: 1800,
    renewableShare: 18
  },
  'Himachal Pradesh': {
    consumption: 1200,
    generation: 1500,
    total: 1800,
    peak: 1400,
    base: 500,
    renewableShare: 95
  },
  'Jharkhand': {
    consumption: 2400,
    generation: 2200,
    total: 3000,
    peak: 2600,
    base: 1000,
    renewableShare: 12
  },
  'Karnataka': {
    consumption: 7200,
    generation: 7500,
    total: 8500,
    peak: 7800,
    base: 3000,
    renewableShare: 65
  },
  'Kerala': {
    consumption: 4500,
    generation: 3800,
    total: 5500,
    peak: 4800,
    base: 2000,
    renewableShare: 30
  },
  'Madhya Pradesh': {
    consumption: 5800,
    generation: 6200,
    total: 7000,
    peak: 6300,
    base: 2500,
    renewableShare: 25
  },
  'Maharashtra': {
    consumption: 12500,
    generation: 13000,
    total: 15000,
    peak: 13500,
    base: 5000,
    renewableShare: 35
  },
  'Manipur': {
    consumption: 250,
    generation: 200,
    total: 350,
    peak: 280,
    base: 100,
    renewableShare: 40
  },
  'Meghalaya': {
    consumption: 350,
    generation: 300,
    total: 450,
    peak: 380,
    base: 150,
    renewableShare: 45
  },
  'Mizoram': {
    consumption: 150,
    generation: 120,
    total: 200,
    peak: 170,
    base: 70,
    renewableShare: 35
  },
  'Nagaland': {
    consumption: 180,
    generation: 150,
    total: 250,
    peak: 200,
    base: 80,
    renewableShare: 30
  },
  'Odisha': {
    consumption: 3800,
    generation: 4200,
    total: 4500,
    peak: 4000,
    base: 1600,
    renewableShare: 15
  },
  'Punjab': {
    consumption: 5500,
    generation: 5200,
    total: 6500,
    peak: 5800,
    base: 2300,
    renewableShare: 20
  },
  'Rajasthan': {
    consumption: 6800,
    generation: 7500,
    total: 8000,
    peak: 7200,
    base: 2800,
    renewableShare: 45
  },
  'Sikkim': {
    consumption: 150,
    generation: 200,
    total: 250,
    peak: 180,
    base: 70,
    renewableShare: 90
  },
  'Tamil Nadu': {
    consumption: 9200,
    generation: 9800,
    total: 11000,
    peak: 9800,
    base: 3800,
    renewableShare: 50
  },
  'Telangana': {
    consumption: 4800,
    generation: 4500,
    total: 6000,
    peak: 5200,
    base: 2000,
    renewableShare: 25
  },
  'Tripura': {
    consumption: 280,
    generation: 250,
    total: 350,
    peak: 300,
    base: 120,
    renewableShare: 20
  },
  'Uttar Pradesh': {
    consumption: 11500,
    generation: 10800,
    total: 13000,
    peak: 12000,
    base: 4500,
    renewableShare: 15
  },
  'Uttarakhand': {
    consumption: 1800,
    generation: 2200,
    total: 2500,
    peak: 2000,
    base: 800,
    renewableShare: 85
  },
  'West Bengal': {
    consumption: 7200,
    generation: 6800,
    total: 8500,
    peak: 7800,
    base: 3000,
    renewableShare: 18
  },
  'Delhi': {
    consumption: 6500,
    generation: 4500,
    total: 7000,
    peak: 6800,
    base: 2800,
    renewableShare: 10
  }
};

function Dashboard() {
  const [selectedState, setSelectedState] = useState(null);
  const [loadBalancingData, setLoadBalancingData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const { swarmState, dispatch } = useSwarm();
  const [isLoading, setIsLoading] = useState(true);
  const [loadBalancingError, setLoadBalancingError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLoadBalancingData = async () => {
      try {
        // Create real-time grid data with more realistic values
        const gridData = {
          totalLoad: 5000, // MW
          peakHours: '14:00-18:00',
          regions: 5,
          distribution: {
            North: 2500, // MW
            South: 1800,
            East: 900,
            West: 1100,
            Central: 800
          },
          weatherPredictions: {
            North: {
              temperature: 32,
              humidity: 65,
              cloudCover: 20,
              windSpeed: 15
            },
            South: {
              temperature: 28,
              humidity: 75,
              cloudCover: 60,
              windSpeed: 12
            }
          }
        };

        // Get recommendations from Gemini API
        const loadBalancing = await geminiService.getLoadBalancingRecommendations(gridData);
        
        if (loadBalancing.recommendations && Array.isArray(loadBalancing.recommendations)) {
          const totalCapacity = 7000; // MW - Total grid capacity
          setLoadBalancingData(loadBalancing.recommendations.map(rec => ({
            region: rec.region,
            currentLoad: (gridData.distribution[rec.region] / totalCapacity) * 100 || 0, // Convert to percentage
            action: `${rec.action} MW`,
            priority: rec.priority || 'High',
            gridStability: rec.gridStability || 90,
            weather: rec.weather || 'Predicting weather conditions...'
          })));
          setLoadBalancingError(null);
        } else {
          throw new Error('Invalid load balancing data received');
        }
      } catch (error) {
        console.error('Error fetching load balancing data:', error);
        setLoadBalancingError(error.message);
        // Set default data with corrected percentages
        setLoadBalancingData([
          {
            region: 'North',
            currentLoad: 35.7, // (2500/7000)*100
            action: 'Reduce load by 300MW',
            priority: 'High',
            gridStability: 90,
            weather: 'Sunny with moderate wind'
          },
          {
            region: 'South',
            currentLoad: 25.7, // (1800/7000)*100
            action: 'Increase load by 300MW',
            priority: 'High',
            gridStability: 90,
            weather: 'Partly cloudy with light wind'
          }
        ]);
      }
    };

    fetchLoadBalancingData();
    const interval = setInterval(fetchLoadBalancingData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    
    // Get state-specific energy data
    const data = stateEnergyData[state] || {
      consumption: 0,
      generation: 0,
      total: 0,
      peak: 0,
      base: 0,
      renewableShare: 0
    };
    
    setStateData({
      state,
      ...data
    });
  };

  const getSeason = () => {
    const date = new Date();
    const month = date.getMonth();
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
  };

  if (isLoading) {
    return <LoadingScreen text="Loading Dashboard Data..." />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BeeTrail />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* AI-Driven Energy Predictions - Full Width at Top */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.2)',
                  mb: 3,
                }}
              >
                <EnergyPredictions selectedState={selectedState} data={stateData} />
              </Paper>
            </Grid>

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
                  {/* Smart Grid Management Dashboard */}
                </Typography>
              
              </Paper>  
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} container spacing={3}>
              {/* Left Column - Map and Load Balancing */}
              <Grid item xs={12} md={7} lg={8} container spacing={3}>
                {/* Map Section */}
                <Grid item xs={12} md={8}>
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
                      Smart Grid Network
                    </Typography>
                    <Box sx={{ flexGrow: 1, position: 'relative', height: '100%' }}>
                      <IndiaMap onStateSelect={handleStateSelect} />
                      <BeeTrail />
                    </Box>
                  </Paper>
                </Grid>

                {/* Dynamic Load Balancing */}
                <Grid item xs={12}>
                  <DynamicLoadBalancing data={loadBalancingData} error={loadBalancingError} />
                </Grid>
              </Grid>

              {/* Right Column - Energy Overview and Historical Data */}
              <Grid item xs={12} md={5} lg={4} container spacing={3}>
                {/* Energy Overview */}
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
                    <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
                      Energy Overview {selectedState ? `- ${selectedState}` : ''}
                    </Typography>
                    <EnergyConsumptionOverview data={stateData} />
                  </Paper>
                </Grid>

                {/* Historical Data */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      background: 'rgba(26, 26, 26, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 183, 77, 0.2)',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#FFD180', mb: 2 }}>
                      Historical Data
                    </Typography>
                    <HistoricalData data={stateData} />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
}

export default Dashboard;
