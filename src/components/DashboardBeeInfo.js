import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PeopleIcon from '@mui/icons-material/People';
import HubIcon from '@mui/icons-material/Hub';
import BalanceIcon from '@mui/icons-material/Balance';

const DashboardBeeInfo = () => {
  const infoCards = [
    {
      title: "Community Power",
      content: "Similar to bee colonies working together, our smart grid enables community-based energy sharing and optimization.",
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#FFD180' }} />
    },
    {
      title: "Smart Load Balancing",
      content: "Our AI-driven system recommends optimal load distribution across regions, ensuring efficient energy usage and grid stability.",
      icon: <BalanceIcon sx={{ fontSize: 40, color: '#FFD180' }} />
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {infoCards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              sx={{
                p: 2,
                height: '100%',
                background: 'rgba(38, 38, 38, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 183, 77, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Box sx={{ mb: 2 }}>
                {card.icon}
              </Box>
              <Typography variant="h6" component="h3" sx={{ mb: 1, color: '#FFD180' }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {card.content}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardBeeInfo;
