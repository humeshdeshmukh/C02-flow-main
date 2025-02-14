import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TradingChart from '../components/trading/TradingChart';

import TradingForm from '../components/trading/TradingForm';
import TransactionHistory from '../components/trading/TransactionHistory';
import { useTradingContext } from '../context/TradingContext';

const Trading = () => {
  const { marketData, executeTransaction } = useTradingContext();
  const [timeRange, setTimeRange] = useState('24H');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const now = new Date();
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now - i * 3600000);
        data.push({
          time: time.toLocaleTimeString(),
          price: 10 + Math.random() * 5,
        });
      }
      setChartData(data);
    };

    generateChartData();
    const interval = setInterval(generateChartData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleOrderSubmit = async (order) => {
    const result = await executeTransaction(order);
    if (result.success) {
      console.log('Transaction completed:', result.contractTerms);
    } else {
      console.error('Transaction failed:', result.error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 183, 77, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          {/* Page Title */}
        

          <Container maxWidth="xl" sx={{ 
            py: 3,
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Grid container spacing={3}>
              {/* Trading Chart */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3,
                      mb: 3,
                      height: '400px',
                      background: 'rgba(26, 26, 26, 0.98)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 183, 77, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <TradingChart data={chartData} />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Left Column: Transaction History */}
              <Grid item xs={12} lg={8}>
                {/* Transaction History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ flex: 1, minHeight: 0 }}
                >
                  <Paper
                    elevation={0}
                    sx={{ 
                      flex: 1,
                      minHeight: 0,
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(26, 26, 26, 0.98)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 183, 77, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <TransactionHistory />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Right Column: Trading Form and Order Book */}
              <Grid item xs={12} lg={4}>
                {/* Trading Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ marginBottom: 24 }}
                >
                  <Paper
                    elevation={0}
                    sx={{ 
                      p: 3,
                      background: 'rgba(26, 26, 26, 0.98)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 183, 77, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <TradingForm onSubmit={handleOrderSubmit} />
                  </Paper>
                </motion.div>

               
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 3,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.2)',
                }}>
               
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 3,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.2)',
                }}>
                
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 3,
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 183, 77, 0.2)',
                }}>
                 
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List>
               
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                 
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default Trading;
