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
} from '@mui/material';
import { motion } from 'framer-motion';

const AIClassification = ({ data, onNext, onBack }) => {
  const [classifiedData, setClassifiedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate AI classification process
    const timer = setTimeout(() => {
      const classified = {
        scope1: {
          fuelConsumption: {
            value: data.fuelConsumption,
            confidence: 0.95,
          },
        },
        scope2: {
          electricityUsage: {
            value: data.electricityUsage,
            confidence: 0.98,
          },
        },
        scope3: {
          businessTravel: {
            value: data.businessTravel,
            confidence: 0.92,
          },
        },
      };
      setClassifiedData(classified);
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [data]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const handleContinue = () => {
    onNext(classifiedData);
  };

  if (isProcessing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Grid container spacing={3}>
        {['scope1', 'scope2', 'scope3'].map((scope) => (
          <Grid item xs={12} md={4} key={scope}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#FFB74D' }}>
                {scope.toUpperCase()}
              </Typography>
              <List>
                {Object.entries(classifiedData[scope]).map(([key, { value, confidence }]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      secondary={`Value: ${value}`}
                    />
                    <Chip
                      label={`${(confidence * 100).toFixed(0)}%`}
                      color={getConfidenceColor(confidence)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button onClick={handleContinue} variant="contained">
          Continue
        </Button>
      </Box>
    </motion.div>
  );
};

export default AIClassification;
