import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Timeline,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { classifyEmission } from './utils/EmissionClassifier';

const AIClassification = ({ data, onNext, onBack }) => {
  const [classifiedData, setClassifiedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const classifyEmissions = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        const classified = {
          scope1: {
            fuelConsumption: null,
            electricityUsage: null,
            businessTravel: null
          },
          scope2: {
            fuelConsumption: null,
            electricityUsage: null,
            businessTravel: null
          },
          scope3: {
            fuelConsumption: null,
            electricityUsage: null,
            businessTravel: null
          },
          factors: [],
          totalConfidence: 0,
          classificationCount: 0,
        };

        // Classify fuel consumption
        if (data?.fuelConsumption) {
          try {
            const fuelResult = await classifyEmission({
              type: 'fuel_consumption',
              value: data.fuelConsumption,
              fuelType: 'petrol'
            });
            if (fuelResult && fuelResult.scope) {
              classified[fuelResult.scope].fuelConsumption = {
                value: data.fuelConsumption,
                ...fuelResult
              };
              classified.totalConfidence += fuelResult.confidence || 0;
              classified.classificationCount++;
              if (fuelResult.details?.factors) {
                classified.factors.push(...fuelResult.details.factors);
              }
            }
          } catch (err) {
            console.error('Error classifying fuel consumption:', err);
          }
        }

        // Classify electricity usage
        if (data?.electricityUsage) {
          try {
            const electricityResult = await classifyEmission({
              type: 'electricity',
              value: data.electricityUsage
            });
            if (electricityResult && electricityResult.scope) {
              classified[electricityResult.scope].electricityUsage = {
                value: data.electricityUsage,
                ...electricityResult
              };
              classified.totalConfidence += electricityResult.confidence || 0;
              classified.classificationCount++;
              if (electricityResult.details?.factors) {
                classified.factors.push(...electricityResult.details.factors);
              }
            }
          } catch (err) {
            console.error('Error classifying electricity usage:', err);
          }
        }

        // Classify business travel
        if (data?.businessTravel) {
          try {
            const travelResult = await classifyEmission({
              type: 'business_travel',
              value: data.businessTravel,
              mode: 'car'
            });
            if (travelResult && travelResult.scope) {
              classified[travelResult.scope].businessTravel = {
                value: data.businessTravel,
                ...travelResult
              };
              classified.totalConfidence += travelResult.confidence || 0;
              classified.classificationCount++;
              if (travelResult.details?.factors) {
                classified.factors.push(...travelResult.details.factors);
              }
            }
          } catch (err) {
            console.error('Error classifying business travel:', err);
          }
        }

        // Calculate average confidence
        classified.averageConfidence = 
          classified.classificationCount > 0
            ? classified.totalConfidence / classified.classificationCount
            : 0;

        // Remove duplicates from factors
        classified.factors = [...new Set(classified.factors)];

        setClassifiedData(classified);
        setIsProcessing(false);
      } catch (error) {
        console.error('Classification error:', error);
        setError('Error classifying emission data');
        setIsProcessing(false);
      }
    };

    if (data) {
      classifyEmissions();
    }
  }, [data]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const renderScopeSection = (scope, scopeData) => {
    const entries = Object.entries(scopeData || {}).filter(([_, data]) => data !== null);
    if (entries.length === 0) return null;

    return (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              {scope.toUpperCase()}
            </Typography>
            <List>
              {entries.map(([key, data]) => (
                data && (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      secondary={
                        <Box component="div">
                          <Box component="span" sx={{ display: 'block' }}>
                            Value: {data.value ? data.value.toFixed(2) : 'N/A'}
                          </Box>
                          {data.details?.recommendations?.map((rec, idx) => (
                            <Box
                              key={idx}
                              component="span"
                              sx={{ display: 'block', mt: 1 }}
                            >
                              • {rec}
                            </Box>
                          ))}
                        </Box>
                      }
                    />
                    <Box sx={{ ml: 2, textAlign: 'right' }}>
                      {data.confidence && (
                        <Chip
                          label={`${(data.confidence * 100).toFixed(0)}%`}
                          color={getConfidenceColor(data.confidence)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}
                      <Tooltip title="Classification confidence">
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                )
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (isProcessing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button onClick={onBack} variant="contained" sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Emission Classification Results
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Overall Classification Confidence:{' '}
          <Chip
            label={`${(classifiedData.averageConfidence * 100).toFixed(0)}%`}
            color={getConfidenceColor(classifiedData.averageConfidence)}
          />
        </Typography>

        <Grid container spacing={3}>
          {renderScopeSection('scope1', classifiedData.scope1)}
          {renderScopeSection('scope2', classifiedData.scope2)}
          {renderScopeSection('scope3', classifiedData.scope3)}
        </Grid>

        {classifiedData.factors.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Classification Factors
            </Typography>
            <Grid container spacing={1}>
              {classifiedData.factors.map((factor, index) => (
                <Grid item key={index}>
                  <Chip
                    label={factor}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button
          onClick={() => onNext(classifiedData)}
          variant="contained"
          color="primary"
        >
          Continue
        </Button>
      </Box>
    </motion.div>
  );
};

export default AIClassification;
