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
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { Upload as UploadIcon, Edit as EditIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { parseFile } from './utils/FileParser';
import { calculateEmissions } from './utils/EmissionClassifier';

const DataCollection = ({ onNext }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [manualData, setManualData] = useState({
    fuelConsumption: '',
    electricityUsage: '',
    businessTravel: '',
  });
  const [energyTypes, setEnergyTypes] = useState({
    fuelType: 'petrol',
    electricitySource: 'coal',
    transportMode: 'car',
  });
  const [file, setFile] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  const handleManualDataChange = (field) => (event) => {
    setManualData({
      ...manualData,
      [field]: event.target.value,
    });
  };

  const handleEnergyTypeChange = (field) => (event) => {
    setEnergyTypes({
      ...energyTypes,
      [field]: event.target.value,
    });
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(uploadedFile.type)) {
        setError('Invalid file type. Please upload a PDF, Excel, CSV, or image file.');
        return;
      }
      
      setFile(uploadedFile);
      setError(null);
    }
  };

  const processManualData = () => {
    try {
      const processedData = {
        fuelConsumption: calculateEmissions.fuel(
          parseFloat(manualData.fuelConsumption) || 0,
          energyTypes.fuelType
        ),
        electricityUsage: calculateEmissions.electricity(
          parseFloat(manualData.electricityUsage) || 0,
          energyTypes.electricitySource
        ),
        businessTravel: calculateEmissions.transport(
          parseFloat(manualData.businessTravel) || 0,
          energyTypes.transportMode
        ),
      };
      return processedData;
    } catch (error) {
      throw new Error('Error processing manual data: ' + error.message);
    }
  };

  const processFileData = async () => {
    try {
      if (!file) {
        throw new Error('Please select a file to upload');
      }

      setParseProgress(0);
      const extractedData = await parseFile(file);
      
      if (!extractedData || Object.values(extractedData).every(v => !v)) {
        throw new Error('No valid emission data found in the file');
      }
      
      setParseProgress(50);
      
      // Calculate emissions from extracted data
      const processedData = {
        fuelConsumption: calculateEmissions.fuel(
          extractedData.fuelConsumption || 0,
          'petrol'
        ),
        electricityUsage: calculateEmissions.electricity(
          extractedData.electricityUsage || 0,
          'coal'
        ),
        businessTravel: calculateEmissions.transport(
          extractedData.businessTravel || 0,
          'car'
        ),
      };
      setParseProgress(100);
      return processedData;
    } catch (error) {
      console.error('File processing error:', error);
      throw new Error(error.message || 'Error processing file');
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const processedData = activeTab === 0 
        ? processManualData()
        : await processFileData();

      if (Object.values(processedData).every(value => value === 0)) {
        throw new Error('No valid emission data found');
      }

      onNext(processedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
              <FormControl fullWidth>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  value={energyTypes.fuelType}
                  onChange={handleEnergyTypeChange('fuelType')}
                >
                  <MenuItem value="petrol">Petrol</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                  <MenuItem value="lpg">LPG</MenuItem>
                </Select>
              </FormControl>
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
              <FormControl fullWidth>
                <InputLabel>Energy Source</InputLabel>
                <Select
                  value={energyTypes.electricitySource}
                  onChange={handleEnergyTypeChange('electricitySource')}
                >
                  <MenuItem value="coal">Coal</MenuItem>
                  <MenuItem value="natural_gas">Natural Gas</MenuItem>
                  <MenuItem value="renewable">Renewable</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Business Travel (km)"
                type="number"
                value={manualData.businessTravel}
                onChange={handleManualDataChange('businessTravel')}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Transport Mode</InputLabel>
                <Select
                  value={energyTypes.transportMode}
                  onChange={handleEnergyTypeChange('transportMode')}
                >
                  <MenuItem value="car">Car</MenuItem>
                  <MenuItem value="bus">Bus</MenuItem>
                  <MenuItem value="train">Train</MenuItem>
                  <MenuItem value="plane">Plane</MenuItem>
                </Select>
              </FormControl>
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
              accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
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
              <Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected file: {file.name}
                </Typography>
                {parseProgress > 0 && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={parseProgress} />
                  </Box>
                )}
              </Box>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Supported formats: PDF, Excel, CSV, Images (JPG, PNG)
            </Typography>
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
