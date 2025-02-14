import React, { useState } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material';
import DataCollection from './DataCollection';
import AIClassification from './AIClassification';
import EmissionCalculation from './EmissionCalculation';
import { motion } from 'framer-motion';

const steps = ['Data Collection', 'AI Classification', 'Emission Calculation'];

const EmissionAnalytics = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [collectedData, setCollectedData] = useState(null);
  const [classifiedData, setClassifiedData] = useState(null);

  const handleNext = (data) => {
    if (activeStep === 0) {
      setCollectedData(data);
    } else if (activeStep === 1) {
      setClassifiedData(data);
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FFB74D', mb: 4 }}>
            Emission Analytics Dashboard
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: '#FFD180' }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <DataCollection onNext={handleNext} />
            )}
            {activeStep === 1 && (
              <AIClassification 
                data={collectedData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {activeStep === 2 && (
              <EmissionCalculation 
                data={classifiedData}
                onBack={handleBack}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default EmissionAnalytics;
