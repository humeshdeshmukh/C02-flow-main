import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Tab, 
  Tabs,
  IconButton,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TokenIcon from '@mui/icons-material/Token';

const houses = [
  { 
    name: 'Sharma House', 
    color: '#FFB74D',
    icon: '🌞',
    specialty: 'Solar Champions'
  },
  { 
    name: 'Koli House', 
    color: '#81C784',
    icon: '🌱',
    specialty: 'Green Warriors'
  },
  { 
    name: 'Dhoble House', 
    color: '#64B5F6',
    icon: '💧',
    specialty: 'Water Conservers'
  },
  { 
    name: 'Patil House', 
    color: '#BA68C8',
    icon: '⚡',
    specialty: 'Energy Innovators'
  },
  { 
    name: 'Desai House', 
    color: '#FF8A65',
    icon: '♻️',
    specialty: 'Recycling Masters'
  },
  { 
    name: 'Joshi House', 
    color: '#90A4AE',
    icon: '🌍',
    specialty: 'Earth Guardians'
  },
];

const achievements = {
  energySaver: { icon: <ElectricBoltIcon />, name: 'Energy Saver' },
  greenChampion: { icon: <StarIcon />, name: 'Green Champion' },
  streakMaster: { icon: <WhatshotIcon />, name: 'Streak Master' },
  topPerformer: { icon: <WorkspacePremiumIcon />, name: 'Top Performer' },
  rapidProgress: { icon: <TrendingUpIcon />, name: 'Rapid Progress' },
};

const Leaderboard = () => {
  const theme = useTheme();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [selectedHouse, setSelectedHouse] = useState(null);

  useEffect(() => {
    const generateRandomScores = () => {
      return houses.map(house => ({
        ...house,
        score: Math.floor(Math.random() * 1000),
        sustainabilityRating: Math.floor(Math.random() * 5) + 1,
        energySaved: Math.floor(Math.random() * 100),
        weeklyStreak: Math.floor(Math.random() * 10),
        monthlyProgress: Math.floor(Math.random() * 100),
        achievements: Object.keys(achievements).filter(() => Math.random() > 0.5),
        detailedMetrics: {
          carbonReduction: Math.floor(Math.random() * 1000),
          waterSaved: Math.floor(Math.random() * 500),
          renewableUsage: Math.floor(Math.random() * 100),
          wasteRecycled: Math.floor(Math.random() * 200),
        }
      }));
    };

    const sortedData = generateRandomScores()
      .sort((a, b) => b.score - a.score)
      .map((house, index) => ({
        ...house,
        carbonCurrency: calculateCarbonCurrency(index, house.score)
      }));
    setLeaderboardData(sortedData);
  }, [timeFrame]);

  const calculateCarbonCurrency = (position, score) => {
    // Base amount based on position
    const baseAmount = Math.max(1000 - (position * 100), 200);
    // Bonus based on score
    const scoreBonus = Math.floor(score * 0.5);
    return baseAmount + scoreBonus;
  };

  const handleTimeFrameChange = (event, newValue) => {
    setTimeFrame(newValue);
  };

  const getScoreColor = (index) => {
    switch(index) {
      case 0: return 'rgba(255, 183, 77, 0.2)'; // Golden
      case 1: return 'rgba(192, 192, 192, 0.1)'; // Silver
      case 2: return 'rgba(205, 127, 50, 0.1)'; // Bronze
      default: return 'rgba(26, 26, 26, 0.6)'; // Dark background
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        background: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 183, 77, 0.2)',
        color: 'white',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        borderBottom: '1px solid rgba(255, 183, 77, 0.2)',
        pb: 2
      }}>
        <Typography variant="h5" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#FFB74D',
          fontWeight: 'bold'
        }}>
          <StarIcon sx={{ color: '#FFB74D' }} />
          Climate Impact Leaderboard
        </Typography>
        <Tabs
          value={timeFrame}
          onChange={handleTimeFrameChange}
          size="small"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#FFB74D',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FFB74D',
            },
          }}
        >
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
          <Tab label="All Time" value="allTime" />
        </Tabs>
      </Box>

      <List>
        {leaderboardData.map((house, index) => (
          <ListItem
            key={house.name}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundColor: getScoreColor(index),
              border: '1px solid rgba(255, 183, 77, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                backgroundColor: 'rgba(255, 183, 77, 0.1)',
              }
            }}
          >
            <ListItemAvatar>
              <Badge
                badgeContent={index < 3 ? index + 1 : null}
                color={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'error'}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: index === 0 ? '#FFB74D' : 
                                   index === 1 ? '#90A4AE' : 
                                   '#CD7F32',
                    color: '#1A1A1A'
                  }
                }}
              >
                <Avatar sx={{ 
                  bgcolor: 'rgba(26, 26, 26, 0.9)',
                  border: `2px solid ${house.color}`,
                  color: house.color
                }}>
                  {house.icon}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: house.color, fontWeight: 'bold' }}>
                    {house.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    ({house.specialty})
                  </Typography>
                  <Chip 
                    icon={<TokenIcon />}
                    label={`${house.carbonCurrency} CC`}
                    size="small"
                    sx={{
                      ml: 'auto',
                      backgroundColor: 'rgba(46, 196, 182, 0.1)',
                      color: '#2EC4B6',
                      border: '1px solid rgba(46, 196, 182, 0.3)',
                      '& .MuiChip-icon': {
                        color: '#2EC4B6'
                      },
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Score: ${house.score}`} 
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 183, 77, 0.1)',
                        color: '#FFB74D',
                        border: '1px solid rgba(255, 183, 77, 0.3)',
                      }}
                    />
                    <Chip 
                      label={`Energy Saved: ${house.energySaved}kWh`} 
                      size="small"
                      icon={<ElectricBoltIcon />}
                      sx={{
                        backgroundColor: 'rgba(129, 199, 132, 0.1)',
                        color: '#81C784',
                        border: '1px solid rgba(129, 199, 132, 0.3)',
                        '& .MuiChip-icon': {
                          color: '#81C784'
                        }
                      }}
                    />
                    <Chip 
                      label={`Streak: ${house.weeklyStreak} weeks`} 
                      size="small"
                      icon={<WhatshotIcon />}
                      sx={{
                        backgroundColor: 'rgba(255, 138, 101, 0.1)',
                        color: '#FF8A65',
                        border: '1px solid rgba(255, 138, 101, 0.3)',
                        '& .MuiChip-icon': {
                          color: '#FF8A65'
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {house.achievements.map((achievement) => (
                      <Tooltip key={achievement} title={achievements[achievement].name}>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: house.color,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        >
                          {achievements[achievement].icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Leaderboard;
