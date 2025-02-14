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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
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
  Assessment,
  LocalShipping,
  Gavel,
  Description,
  PictureAsPdf,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  getEmissionInsights,
  generateReductionStrategies,
  predictFutureEmissions,
  generateSustainabilityReport,
  analyzeSupplyChain,
  generateComplianceReport,
} from '../../services/aiService';
import { generateComprehensiveReport } from './ReportGenerator';

const EmissionCalculation = ({ data, onBack }) => {
  const [calculatedData, setCalculatedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [reductionStrategies, setReductionStrategies] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [sustainabilityReport, setSustainabilityReport] = useState(null);
  const [supplyChainAnalysis, setSupplyChainAnalysis] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    insights: false,
    strategies: false,
    predictions: false,
    sustainability: false,
    supplyChain: false,
    compliance: false,
  });
  const [errors, setErrors] = useState({
    insights: null,
    strategies: null,
    predictions: null,
    sustainability: null,
    supplyChain: null,
    compliance: null,
  });
  const [reportLoading, setReportLoading] = useState(false);

  const handleError = (section, error) => {
    console.error(`Error in ${section}:`, error);
    setErrors(prev => ({
      ...prev,
      [section]: error.message
    }));
    setLoadingStates(prev => ({
      ...prev,
      [section]: false
    }));
  };

  useEffect(() => {
    const calculateEmissions = () => {
      try {
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
      } catch (error) {
        handleError('insights', error);
      }
    };

    calculateEmissions();
  }, [data]);

  const fetchInsights = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, insights: true }));
    try {
      const insights = await getEmissionInsights(calculatedData.calculated);
      setAiInsights(insights);
      setErrors(prev => ({ ...prev, insights: null }));
    } catch (error) {
      handleError('insights', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, insights: false }));
    }
  };

  const fetchReductionStrategies = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, strategies: true }));
    try {
      const strategies = await generateReductionStrategies(calculatedData.calculated);
      setReductionStrategies(strategies);
      setErrors(prev => ({ ...prev, strategies: null }));
    } catch (error) {
      handleError('strategies', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, strategies: false }));
    }
  };

  const fetchPredictions = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, predictions: true }));
    try {
      const predictions = await predictFutureEmissions(calculatedData.calculated);
      setPredictions(predictions);
      setErrors(prev => ({ ...prev, predictions: null }));
    } catch (error) {
      handleError('predictions', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, predictions: false }));
    }
  };

  const fetchSustainabilityReport = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, sustainability: true }));
    try {
      const report = await generateSustainabilityReport({
        emissions: calculatedData.calculated,
        predictions: predictions,
        strategies: reductionStrategies,
      });
      setSustainabilityReport(report);
      setErrors(prev => ({ ...prev, sustainability: null }));
    } catch (error) {
      handleError('sustainability', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, sustainability: false }));
    }
  };

  const fetchSupplyChainAnalysis = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, supplyChain: true }));
    try {
      const analysis = await analyzeSupplyChain(calculatedData.calculated);
      setSupplyChainAnalysis(analysis);
      setErrors(prev => ({ ...prev, supplyChain: null }));
    } catch (error) {
      handleError('supplyChain', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, supplyChain: false }));
    }
  };

  const fetchComplianceReport = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, compliance: true }));
    try {
      const report = await generateComplianceReport(calculatedData.calculated, 'US');
      setComplianceReport(report);
      setErrors(prev => ({ ...prev, compliance: null }));
    } catch (error) {
      handleError('compliance', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, compliance: false }));
    }
  };

  useEffect(() => {
    if (calculatedData) {
      fetchInsights();
      fetchReductionStrategies();
      fetchPredictions();
      fetchSustainabilityReport();
      fetchSupplyChainAnalysis();
      fetchComplianceReport();
    }
  }, [calculatedData]);

  const renderError = (section) => {
    if (!errors[section]) return null;
    
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {errors[section]}
      </Alert>
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const reportData = {
        calculatedData,
        aiInsights,
        reductionStrategies,
        predictions,
        sustainabilityReport,
        supplyChainAnalysis,
        complianceReport,
      };

      const doc = generateComprehensiveReport(reportData);
      doc.save('CO2Flow-Comprehensive-Report.pdf');
    } catch (error) {
      console.error('Error generating report:', error);
      // enqueueSnackbar('Error generating report. Please try again.', { variant: 'error' });
    } finally {
      setReportLoading(false);
    }
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
    <Box>
      {renderError('insights')}
      {loadingStates.insights ? (
        <CircularProgress />
      ) : aiInsights ? (
        <Grid container spacing={3}>
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
        </Grid>
      ) : null}
    </Box>
  );

  const renderReductionStrategies = () => (
    <Box>
      {renderError('strategies')}
      {loadingStates.strategies ? (
        <CircularProgress />
      ) : reductionStrategies ? (
        <Grid container spacing={3}>
          {Object.entries(reductionStrategies).map(([timeframe, data]) => (
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
                    {data.strategies.map((strategy, index) => (
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
          ))}
        </Grid>
      ) : null}
    </Box>
  );

  const renderPredictions = () => (
    <Box>
      {renderError('predictions')}
      {loadingStates.predictions ? (
        <CircularProgress />
      ) : predictions ? (
        <Grid container spacing={3}>
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
        </Grid>
      ) : null}
    </Box>
  );

  const renderSustainabilityReport = () => (
    <Box>
      {renderError('sustainability')}
      {loadingStates.sustainability ? (
        <CircularProgress />
      ) : sustainabilityReport ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                Executive Summary
              </Typography>
              <List>
                {sustainabilityReport.executiveSummary.keyFindings.map((finding, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Assessment sx={{ color: '#FFB74D' }} />
                    </ListItemIcon>
                    <ListItemText primary={finding} />
                  </ListItem>
                ))}
              </List>
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
                Risk Assessment
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={sustainabilityReport.riskAssessment.metrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Risk Level"
                    dataKey="value"
                    stroke="#FFB74D"
                    fill="#FFB74D"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );

  const renderSupplyChainAnalysis = () => (
    <Box>
      {renderError('supplyChain')}
      {loadingStates.supplyChain ? (
        <CircularProgress />
      ) : supplyChainAnalysis ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                Supply Chain Hotspots
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#FFB74D' }}>Area</TableCell>
                      <TableCell sx={{ color: '#FFB74D' }}>Emission Level</TableCell>
                      <TableCell sx={{ color: '#FFB74D' }}>Priority</TableCell>
                      <TableCell sx={{ color: '#FFB74D' }}>Action Required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplyChainAnalysis.hotspots.map((hotspot, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: 'white' }}>{hotspot.area}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{hotspot.emissionLevel}</TableCell>
                        <TableCell>
                          <Chip
                            label={hotspot.priority}
                            color={
                              hotspot.priority === 'High'
                                ? 'error'
                                : hotspot.priority === 'Medium'
                                ? 'warning'
                                : 'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{hotspot.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );

  const renderComplianceReport = () => (
    <Box>
      {renderError('compliance')}
      {loadingStates.compliance ? (
        <CircularProgress />
      ) : complianceReport ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>
                Compliance Status
              </Typography>
              <List>
                {complianceReport.requirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Gavel sx={{ color: '#FFB74D' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={req.requirement}
                      secondary={
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Status: {req.status}
                        </Typography>
                      }
                    />
                    <Chip
                      label={req.compliance ? 'Compliant' : 'Action Required'}
                      color={req.compliance ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </Box>
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
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Timeline />} label="Current Emissions" />
          <Tab icon={<TrendingUp />} label="AI Insights" />
          <Tab icon={<EmojiObjects />} label="Reduction Strategies" />
          <Tab icon={<Timeline />} label="Predictions" />
          <Tab icon={<Description />} label="Sustainability Report" />
          <Tab icon={<LocalShipping />} label="Supply Chain" />
          <Tab icon={<Gavel />} label="Compliance" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderCurrentEmissions()}
      {activeTab === 1 && renderAIInsights()}
      {activeTab === 2 && renderReductionStrategies()}
      {activeTab === 3 && renderPredictions()}
      {activeTab === 4 && renderSustainabilityReport()}
      {activeTab === 5 && renderSupplyChainAnalysis()}
      {activeTab === 6 && renderComplianceReport()}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={reportLoading || !calculatedData}
          startIcon={reportLoading ? <CircularProgress size={20} /> : <PictureAsPdf />}
          sx={{ backgroundColor: '#FFB74D', '&:hover': { backgroundColor: '#FFA726' } }}
        >
          Generate Comprehensive Report
        </Button>
      </Box>
    </motion.div>
  );
};

export default EmissionCalculation;
