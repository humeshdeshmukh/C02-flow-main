import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, TextField, Slider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import GoalTracker from './GoalTracker';
// import HistoricalChart from './HistoricalChart';
import PeerComparison from './PeerComparison';
import Leaderboard from '../Leaderboard/Leaderboard';

const ClimateImpactAnalysis = () => {
  const [electricityUsage, setElectricityUsage] = useState(0);
  const [waterUsage, setWaterUsage] = useState(0);
  const [transportationType, setTransportationType] = useState('car');
  const [transportationDistance, setTransportationDistance] = useState(0);
  const [wasteGeneration, setWasteGeneration] = useState(0);
  const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0);

  // Carbon footprint factors (kg CO2 per unit)
  const carbonFactors = {
    electricity: 0.85, // per kWh
    water: 0.419, // per cubic meter
    transportation: {
      car: 0.2, // per km
      bus: 0.08, // per km
      train: 0.04, // per km
      bike: 0, // per km
    },
    waste: 0.57, // per kg
  };

  useEffect(() => {
    // Calculate total carbon footprint
    const electricityCarbon = electricityUsage * carbonFactors.electricity;
    const waterCarbon = waterUsage * carbonFactors.water;
    const transportationCarbon = transportationDistance * carbonFactors.transportation[transportationType];
    const wasteCarbon = wasteGeneration * carbonFactors.waste;

    const total = electricityCarbon + waterCarbon + transportationCarbon + wasteCarbon;
    setTotalCarbonFootprint(total);
  }, [electricityUsage, waterUsage, transportationType, transportationDistance, wasteGeneration]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Climate Impact Analysis
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Carbon Calculator Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#FFB74D',
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: '0 0 10px rgba(255, 183, 77, 0.3)',
                    mb: 4,
                    textAlign: 'center'
                  }}
                >
                  Carbon Impact Calculator
                </Typography>
                
                <Grid container spacing={4}>
                  {/* Electricity Usage */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Rajdhani', sans-serif" }}>
                      Monthly Electricity Usage (kWh)
                    </Typography>
                    <Slider
                      value={electricityUsage}
                      onChange={(e, newValue) => setElectricityUsage(newValue)}
                      min={0}
                      max={1000}
                      step={10}
                      sx={{
                        color: '#FFB74D',
                        '& .MuiSlider-thumb': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-track': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 183, 77, 0.3)' },
                      }}
                    />
                    <TextField
                      value={electricityUsage}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value)) setElectricityUsage(value);
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 183, 77, 0.5)' },
                          '&:hover fieldset': { borderColor: '#FFB74D' },
                          '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Water Usage */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Rajdhani', sans-serif" }}>
                      Monthly Water Usage (m³)
                    </Typography>
                    <Slider
                      value={waterUsage}
                      onChange={(e, newValue) => setWaterUsage(newValue)}
                      min={0}
                      max={50}
                      step={1}
                      sx={{
                        color: '#FFB74D',
                        '& .MuiSlider-thumb': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-track': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 183, 77, 0.3)' },
                      }}
                    />
                    <TextField
                      value={waterUsage}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value)) setWaterUsage(value);
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 183, 77, 0.5)' },
                          '&:hover fieldset': { borderColor: '#FFB74D' },
                          '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Transportation */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Rajdhani', sans-serif" }}>
                      Monthly Transportation
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Transport Type</InputLabel>
                      <Select
                        value={transportationType}
                        onChange={(e) => setTransportationType(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 183, 77, 0.5)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFB74D' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFB74D' },
                        }}
                      >
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                        <MenuItem value="train">Train</MenuItem>
                        <MenuItem value="bike">Bicycle</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Distance (km/month)"
                      value={transportationDistance}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value)) setTransportationDistance(value);
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 183, 77, 0.5)' },
                          '&:hover fieldset': { borderColor: '#FFB74D' },
                          '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Waste Generation */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Rajdhani', sans-serif" }}>
                      Monthly Waste Generation (kg)
                    </Typography>
                    <Slider
                      value={wasteGeneration}
                      onChange={(e, newValue) => setWasteGeneration(newValue)}
                      min={0}
                      max={100}
                      step={1}
                      sx={{
                        color: '#FFB74D',
                        '& .MuiSlider-thumb': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-track': { backgroundColor: '#FFB74D' },
                        '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 183, 77, 0.3)' },
                      }}
                    />
                    <TextField
                      value={wasteGeneration}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value)) setWasteGeneration(value);
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 183, 77, 0.5)' },
                          '&:hover fieldset': { borderColor: '#FFB74D' },
                          '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Total Carbon Footprint Display */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        border: '1px solid rgba(255, 183, 77, 0.2)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        Total Carbon Footprint
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          color: '#FFB74D',
                          fontFamily: "'Orbitron', sans-serif",
                          textShadow: '0 0 10px rgba(255, 183, 77, 0.3)',
                        }}
                      >
                        {totalCarbonFootprint.toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mt: 1,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        kg CO₂ per month
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 2, textAlign: 'left' }}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Electricity: {(electricityUsage * carbonFactors.electricity).toFixed(2)} kg CO₂</Typography>
                          <Typography variant="body2">Water: {(waterUsage * carbonFactors.water).toFixed(2)} kg CO₂</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Transportation: {(transportationDistance * carbonFactors.transportation[transportationType]).toFixed(2)} kg CO₂</Typography>
                          <Typography variant="body2">Waste: {(wasteGeneration * carbonFactors.waste).toFixed(2)} kg CO₂</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

           
          
          </Grid>
        </Grid>
        
        {/* Right Column - Leaderboard */}
        <Grid item xs={12} md={4}>
          <Leaderboard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClimateImpactAnalysis;
