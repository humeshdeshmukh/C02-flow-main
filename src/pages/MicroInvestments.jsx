import React from 'react';
import { Box } from '@mui/material';
import MicroInvestment from '../components/MicroInvestment/MicroInvestment';

const MicroInvestments = () => {
  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      minHeight: '100vh',
    }}>
      <MicroInvestment />
    </Box>
  );
};

export default MicroInvestments;
