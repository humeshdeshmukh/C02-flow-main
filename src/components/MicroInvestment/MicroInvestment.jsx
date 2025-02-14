import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  useTheme,
} from '@mui/material';
import TokenIcon from '@mui/icons-material/Token';
import NatureIcon from '@mui/icons-material/Nature';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ParkIcon from '@mui/icons-material/Park';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const investmentOptions = [
  {
    id: 1,
    title: 'Community Solar Project',
    description: 'Support local solar panel installations in community spaces',
    cost: 500,
    icon: <SolarPowerIcon />,
    impact: 'Reduces 2.5 tons of CO2 annually',
    category: 'infrastructure'
  },
  {
    id: 2,
    title: 'Urban Garden Initiative',
    description: 'Fund urban gardens and green spaces in your neighborhood',
    cost: 300,
    icon: <LocalFloristIcon />,
    impact: 'Creates sustainable food sources and green spaces',
    category: 'infrastructure'
  },
  {
    id: 3,
    title: 'Water Conservation System',
    description: 'Install water-saving devices in public buildings',
    cost: 400,
    icon: <WaterDropIcon />,
    impact: 'Saves 100,000 gallons annually',
    category: 'infrastructure'
  },
  {
    id: 4,
    title: 'Eco-Store Discount',
    description: '25% off on sustainable products',
    cost: 200,
    icon: <ShoppingBagIcon />,
    impact: 'Promotes sustainable consumption',
    category: 'rewards'
  },
  {
    id: 5,
    title: 'Green Transport Pass',
    description: 'Monthly public transport pass',
    cost: 350,
    icon: <NatureIcon />,
    impact: 'Reduces individual carbon footprint',
    category: 'rewards'
  },
  {
    id: 6,
    title: 'Park Restoration',
    description: 'Contribute to local park maintenance and tree planting',
    cost: 250,
    icon: <ParkIcon />,
    impact: 'Enhances biodiversity and air quality',
    category: 'infrastructure'
  },
];

const MicroInvestment = ({ carbonCredits = 1000, onInvest }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleInvestClick = (option) => {
    setSelectedOption(option);
    setDialogOpen(true);
  };

  const handleConfirmInvestment = () => {
    if (selectedOption && onInvest) {
      onInvest(selectedOption);
    }
    setDialogOpen(false);
  };

  const filteredOptions = investmentOptions.filter(option => 
    selectedTab === 0 ? option.category === 'infrastructure' : option.category === 'rewards'
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#FFB74D' }}>
          Green Micro-Investments
        </Typography>
        <Chip
          icon={<TokenIcon />}
          label={`${carbonCredits} CC Available`}
          sx={{
            backgroundColor: 'rgba(46, 196, 182, 0.1)',
            color: '#2EC4B6',
            border: '1px solid rgba(46, 196, 182, 0.3)',
            '& .MuiChip-icon': { color: '#2EC4B6' }
          }}
        />
      </Box>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': { color: '#FFB74D' }
          },
          '& .MuiTabs-indicator': { backgroundColor: '#FFB74D' }
        }}
      >
        <Tab label="Infrastructure Projects" />
        <Tab label="Eco Rewards" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredOptions.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 183, 77, 0.2)',
                color: 'white',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(255, 183, 77, 0.2)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#FFB74D' }}>
                  {option.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {option.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {option.description}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Impact: {option.impact}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', p: 2 }}>
                <Chip
                  label={`${option.cost} CC`}
                  sx={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    color: '#2EC4B6',
                    border: '1px solid rgba(46, 196, 182, 0.3)',
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => handleInvestClick(option)}
                  disabled={carbonCredits < option.cost}
                  sx={{
                    color: 'white',
                    borderColor: '#FFB74D',
                    '&:hover': {
                      borderColor: '#FFB74D',
                      backgroundColor: 'rgba(255, 183, 77, 0.1)',
                      color: '#FFB74D',
                    },
                    '&.Mui-disabled': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Invest
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            color: 'white',
            border: '1px solid rgba(255, 183, 77, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFB74D' }}>Confirm Investment</DialogTitle>
        <DialogContent>
          {selectedOption && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedOption.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Cost: {selectedOption.cost} CC
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                {selectedOption.impact}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 183, 77, 0.2)' }} />
              <Typography variant="body2">
                Your remaining balance will be: {carbonCredits - (selectedOption?.cost || 0)} CC
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmInvestment}
            sx={{
              color: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255, 183, 77, 0.1)',
                color: '#FFB74D',
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MicroInvestment;
