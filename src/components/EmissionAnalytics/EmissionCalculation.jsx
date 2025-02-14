import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EmissionCalculation = ({ data, onBack }) => {
  const [calculatedData, setCalculatedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate emission calculation process
    const timer = setTimeout(() => {
      const calculated = {
        scope1: {
          fuelConsumption: {
            value: data.scope1.fuelConsumption.value * 2.68, // kg CO2e per liter
            unit: 'kg CO2e',
          },
        },
        scope2: {
          electricityUsage: {
            value: data.scope2.electricityUsage.value * 0.4, // kg CO2e per kWh
            unit: 'kg CO2e',
          },
        },
        scope3: {
          businessTravel: {
            value: data.scope3.businessTravel.value * 0.14, // kg CO2e per mile
            unit: 'kg CO2e',
          },
        },
      };

      const chartData = [
        {
          name: 'Scope 1',
          emissions: calculated.scope1.fuelConsumption.value,
        },
        {
          name: 'Scope 2',
          emissions: calculated.scope2.electricityUsage.value,
        },
        {
          name: 'Scope 3',
          emissions: calculated.scope3.businessTravel.value,
        },
      ];

      setCalculatedData({ calculated, chartData });
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [data]);

  if (isProcessing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalEmissions = calculatedData.chartData.reduce(
    (sum, item) => sum + item.emissions,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ color: '#FFB74D' }}>
              Total Emissions: {totalEmissions.toFixed(2)} kg CO2e
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              height: 400,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculatedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="emissions"
                  name="CO2 Emissions (kg)"
                  fill="#FFB74D"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onBack} variant="outlined">
              Back
            </Button>
            <Button variant="contained" color="primary">
              Download Report
            </Button>
          </Box>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default EmissionCalculation;
