import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import geminiService from '../services/geminiService';

// Sample weather impact data
const weatherData = [
  { month: 'Jan', temperature: 15, consumption: 1200, humidity: 65 },
  { month: 'Feb', temperature: 18, consumption: 1100, humidity: 60 },
  { month: 'Mar', temperature: 22, consumption: 1000, humidity: 55 },
  { month: 'Apr', temperature: 28, consumption: 1300, humidity: 45 },
  { month: 'May', temperature: 32, consumption: 1500, humidity: 40 },
  { month: 'Jun', temperature: 34, consumption: 1700, humidity: 60 },
  { month: 'Jul', temperature: 30, consumption: 1600, humidity: 75 },
  { month: 'Aug', temperature: 29, consumption: 1550, humidity: 80 },
  { month: 'Sep', temperature: 27, consumption: 1400, humidity: 70 },
  { month: 'Oct', temperature: 24, consumption: 1200, humidity: 65 },
  { month: 'Nov', temperature: 19, consumption: 1100, humidity: 60 },
  { month: 'Dec', temperature: 16, consumption: 1150, humidity: 65 }
];

// Weather tips with icons
const weatherTips = [
  {
    condition: 'High Temperature',
    icon: <LightModeIcon sx={{ color: '#FFB74D' }} />,
    tips: [
      'Schedule high-energy tasks during cooler hours',
      'Use natural ventilation when possible',
      'Maintain optimal thermostat settings',
      'Consider solar energy generation'
    ]
  },
  {
    condition: 'Low Temperature',
    icon: <AcUnitIcon sx={{ color: '#90CAF9' }} />,
    tips: [
      'Insulate to prevent heat loss',
      'Use smart heating controls',
      'Schedule heating during off-peak hours',
      'Regular maintenance of heating systems'
    ]
  },
  {
    condition: 'High Humidity',
    icon: <WaterDropIcon sx={{ color: '#81C784' }} />,
    tips: [
      'Use dehumidifiers efficiently',
      'Improve ventilation systems',
      'Monitor indoor air quality',
      'Optimize HVAC settings'
    ]
  },
  {
    condition: 'Energy Efficiency',
    icon: <DeviceThermostatIcon sx={{ color: '#FFB74D' }} />,
    tips: [
      'Regular equipment maintenance',
      'Use energy-efficient appliances',
      'Monitor real-time consumption',
      'Implement automated controls'
    ]
  }
];

const WeatherImpact = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherImpact = async () => {
      setLoading(true);
      setError(null);
      try {
        const regionData = {
          location: 'Delhi NCR',
          season: 'Summer',
          historicalData: {
            averageTemperature: 32,
            averageHumidity: 65,
            peakConsumptionHours: ['14:00', '15:00', '16:00'],
            typicalWeatherPatterns: ['Hot', 'Humid', 'Partly Cloudy']
          },
          gridCapacity: {
            total: 1000,
            current: 750,
            renewable: 250
          }
        };

        // Get AI predictions for weather impact
        const predictions = await geminiService.predictWeatherImpact(regionData);
        if (predictions && predictions.hourlyData) {
          setWeatherData(predictions.hourlyData);
          setCurrentWeather({
            temperature: predictions.currentConditions.temperature,
            humidity: predictions.currentConditions.humidity,
            condition: predictions.currentConditions.condition
          });
        }
      } catch (error) {
        console.error('Error fetching weather impact data:', error);
        setError('Failed to fetch weather impact predictions. Please try again later.');
        // Use sample data as fallback
        setWeatherData([
          { hour: '00:00', temperature: 25, consumption: 800, humidity: 70 },
          { hour: '06:00', temperature: 24, consumption: 600, humidity: 75 },
          { hour: '12:00', temperature: 32, consumption: 1200, humidity: 60 },
          { hour: '18:00', temperature: 30, consumption: 1000, humidity: 65 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherImpact();
    const interval = setInterval(fetchWeatherImpact, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>Loading weather impact data...</Typography>
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Current Weather Impact */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 183, 77, 0.2)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(255, 183, 77, 0.2)',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: '#FFB74D' }}>
              Weather Impact on Energy Usage
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
              Current conditions: {currentWeather.temperature}°C, {currentWeather.humidity}% humidity, {currentWeather.condition}
            </Typography>
          </Paper>
        </Grid>

        {/* Weather Impact Chart */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 183, 77, 0.2)',
              borderRadius: '8px',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: '#FFB74D' }}>
              24-Hour Weather Impact Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#FFB74D" />
                <YAxis yAxisId="left" stroke="#FFB74D" />
                <YAxis yAxisId="right" orientation="right" stroke="#81C784" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    border: '1px solid rgba(255, 183, 77, 0.2)',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#FFB74D"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="consumption"
                  name="Energy Consumption (kW)"
                  stroke="#81C784"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#90CAF9"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Weather Tips */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {weatherTips.map((tip, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    border: '1px solid rgba(255, 183, 77, 0.2)',
                    borderRadius: '8px',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      {tip.icon}
                      <Typography variant="h6" sx={{ ml: 1, color: '#FFB74D' }}>
                        {tip.condition}
                      </Typography>
                    </Box>
                    <Box>
                      {tip.tips.map((item, i) => (
                        <Typography key={i} variant="body2" sx={{ color: '#fff', mb: 0.5 }}>
                          • {item}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeatherImpact;
