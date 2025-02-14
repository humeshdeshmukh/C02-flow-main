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
} from 'recharts';
import {
  generateSustainabilityReport,
  analyzeSupplyChain,
  generateComplianceReport,
} from '../../services/aiService';
import { generateComprehensiveReport } from './ReportGenerator';

const EmissionCalculation = ({ data, onBack }) => {
  const [calculatedData, setCalculatedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [sustainabilityReport, setSustainabilityReport] = useState(null);
  const [supplyChainAnalysis, setSupplyChainAnalysis] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    sustainability: false,
    supplyChain: false,
    compliance: false,
  });
  const [errors, setErrors] = useState({
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

  useEffect(() => {
    if (calculatedData) {
      fetchSustainabilityReport();
      fetchSupplyChainAnalysis();
      fetchComplianceReport();
    }
  }, [calculatedData]);

  const fetchSustainabilityReport = async () => {
    if (!calculatedData) return;
    
    setLoadingStates(prev => ({ ...prev, sustainability: true }));
    try {
      const report = await generateSustainabilityReport({
        emissions: calculatedData.calculated
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
                <BarChart data={sustainabilityReport.riskAssessment.metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Risk Level"
                    fill="#FFB74D"
                  />
                </BarChart>
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
          <Tab icon={<Description />} label="Sustainability Report" />
          <Tab icon={<LocalShipping />} label="Supply Chain" />
          <Tab icon={<Gavel />} label="Compliance" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderCurrentEmissions()}
      {activeTab === 1 && renderSustainabilityReport()}
      {activeTab === 2 && renderSupplyChainAnalysis()}
      {activeTab === 3 && renderComplianceReport()}

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
