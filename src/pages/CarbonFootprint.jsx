import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import PeerComparison from '../components/CarbonFootprint/PeerComparison';
import GoalTracker from '../components/CarbonFootprint/GoalTracker';

const CarbonFootprint = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Title Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 3,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 183, 77, 0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(255, 183, 77, 0.2)',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: '#FFB74D',
                  fontFamily: "'Orbitron', sans-serif",
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(255, 183, 77, 0.3)',
                }}
              >
                Environmental Impact Dashboard
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Goal Tracker */}
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Paper
              sx={{
                p: 3,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 183, 77, 0.2)',
                borderRadius: '8px',
              }}
            >
              <GoalTracker />
            </Paper>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Peer Comparison */}
          <Paper
            sx={{
              p: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 183, 77, 0.2)',
              borderRadius: '8px',
            }}
          >
            <PeerComparison />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarbonFootprint;
