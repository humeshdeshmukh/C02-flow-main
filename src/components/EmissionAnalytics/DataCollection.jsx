import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Upload as UploadIcon, Edit as EditIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const DataCollection = ({ onNext }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualData, setManualData] = useState({
    fuelConsumption: '',
    electricityUsage: '',
    businessTravel: '',
  });
  const [file, setFile] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleManualDataChange = (field) => (event) => {
    setManualData({
      ...manualData,
      [field]: event.target.value,
    });
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const processedData = activeTab === 0 ? manualData : {
        // Simulated AI-extracted data
        fuelConsumption: '1000',
        electricityUsage: '5000',
        businessTravel: '2000',
      };
      
      setIsProcessing(false);
      onNext(processedData);
    }, 2000);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Manual Entry" icon={<EditIcon />} />
        <Tab label="File Upload" icon={<UploadIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fuel Consumption (liters)"
                type="number"
                value={manualData.fuelConsumption}
                onChange={handleManualDataChange('fuelConsumption')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Electricity Usage (kWh)"
                type="number"
                value={manualData.electricityUsage}
                onChange={handleManualDataChange('electricityUsage')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Business Travel (miles)"
                type="number"
                value={manualData.businessTravel}
                onChange={handleManualDataChange('businessTravel')}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </motion.div>
      )}

      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              borderStyle: 'dashed',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <input
              accept=".pdf,.csv,.xlsx"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload File
              </Button>
            </label>
            {file && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Paper>
        </motion.div>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing}
          sx={{ minWidth: 150 }}
        >
          {isProcessing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Process Data'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DataCollection;
