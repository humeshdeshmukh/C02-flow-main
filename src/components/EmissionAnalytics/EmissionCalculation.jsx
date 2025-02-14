import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp,
  EmojiObjects,
  Timeline,
  SaveAlt,
  Nature,
  AttachMoney,
  Speed,
} from '@mui/icons-material';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { getEmissionInsights, generateReductionStrategies, predictFutureEmissions } from '../../services/aiService';

const EmissionCalculation = ({ data, onBack }) => {
  const [calculatedData, setCalculatedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [reductionStrategies, setReductionStrategies] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    insights: false,
    strategies: false,
    predictions: false,
  });

  useEffect(() => {
    const calculateEmissions = () => {
      const calculated = {
        scope1: {
          fuelConsumption: {
            value: data.scope1.fuelConsumption.value * 2.68,
            unit: 'kg CO2e',
          },
        },
        scope2: {
          electricityUsage: {
            value: data.scope2.electricityUsage.value * 0.4,
            unit: 'kg CO2e',
          },
        },
        scope3: {
          businessTravel: {
            value: data.scope3.businessTravel.value * 0.14,
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
    };

    calculateEmissions();
  }, [data]);

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      try {
        // Get AI Insights
        setLoadingStates(prev => ({ ...prev, insights: true }));
        const insights = await getEmissionInsights(calculatedData.calculated);
        setAiInsights(insights);
        setLoadingStates(prev => ({ ...prev, insights: false }));

        // Get Reduction Strategies
        setLoadingStates(prev => ({ ...prev, strategies: true }));
        const strategies = await generateReductionStrategies(calculatedData.calculated);
        setReductionStrategies(strategies);
        setLoadingStates(prev => ({ ...prev, strategies: false }));

        // Get Predictions
        setLoadingStates(prev => ({ ...prev, predictions: true }));
        const futurePredictions = await predictFutureEmissions(calculatedData.calculated);
        setPredictions(futurePredictions);
        setLoadingStates(prev => ({ ...prev, predictions: false }));
      } catch (error) {
        console.error('AI Analysis Error:', error);
      }
    };

    if (calculatedData && !isProcessing) {
      fetchAIAnalysis();
    }
  }, [calculatedData, isProcessing]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const renderCurrentEmissions = () => (
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
    </Grid>
  );

  const renderAIInsights = () => (
    <Grid container spacing={3}>
      {loadingStates.insights ? (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                Key Insights
              </Typography>
              {aiInsights && (
                <List>
                  {aiInsights.trends.map((trend, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <TrendingUp sx={{ color: '#FFB74D' }} />
                      </ListItemIcon>
                      <ListItemText primary={trend} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                Industry Comparison
              </Typography>
              {aiInsights && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiInsights.industryComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yourEmissions" name="Your Emissions" fill="#FFB74D" />
                    <Bar dataKey="industryAverage" name="Industry Average" fill="#90CAF9" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderReductionStrategies = () => (
    <Grid container spacing={3}>
      {loadingStates.strategies ? (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        reductionStrategies && Object.entries(reductionStrategies).map(([timeframe, strategies]) => (
          <Grid item xs={12} key={timeframe}>
            <Accordion
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ color: '#FFB74D' }}>
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Term Strategies
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {strategies.map((strategy, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Nature sx={{ color: '#FFB74D' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={strategy.action}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Estimated ROI: {strategy.roi}
                            </Typography>
                            <br />
                            <Chip
                              icon={<Speed />}
                              label={`Complexity: ${strategy.complexity}`}
                              size="small"
                              sx={{ mr: 1, mt: 1 }}
                            />
                            <Chip
                              icon={<AttachMoney />}
                              label={`Cost: ${strategy.cost}`}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderPredictions = () => (
    <Grid container spacing={3}>
      {loadingStates.predictions ? (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        predictions && (
          <>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                  Emission Forecasts
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={predictions.forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      name="Predicted Emissions"
                      stroke="#FFB74D"
                      fill="#FFB74D"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      name="Upper Bound"
                      stroke="#FFD180"
                      fill="#FFD180"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      name="Lower Bound"
                      stroke="#FFD180"
                      fill="#FFD180"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                  Key Factors Influencing Predictions
                </Typography>
                <List>
                  {predictions.factors.map((factor, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <EmojiObjects sx={{ color: '#FFB74D' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={factor.name}
                        secondary={
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Impact: {factor.impact}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </>
        )
      )}
    </Grid>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          <Tab icon={<Timeline />} label="Current Emissions" />
          <Tab icon={<TrendingUp />} label="AI Insights" />
          <Tab icon={<EmojiObjects />} label="Reduction Strategies" />
          <Tab icon={<Timeline />} label="Predictions" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderCurrentEmissions()}
      {activeTab === 1 && renderAIInsights()}
      {activeTab === 2 && renderReductionStrategies()}
      {activeTab === 3 && renderPredictions()}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveAlt />}
          onClick={() => {
            // Implement report download functionality
            console.log('Downloading report...');
          }}
        >
          Download Full Report
        </Button>
      </Box>
    </motion.div>
  );
};

export default EmissionCalculation;
