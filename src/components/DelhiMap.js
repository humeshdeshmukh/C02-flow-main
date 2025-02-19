import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geminiService from '../services/geminiService';
import { CircularProgress, Typography, Box } from '@mui/material';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;

// Create custom icons for different types of locations
const locationIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DelhiMap = () => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delhi locations with initial data
  const initialLocations = [
    {
      position: [28.6645, 77.2019],
      name: "Anand Nagar",
      insight: "High residential energy consumption pattern with peak loads during evening hours. Potential for rooftop solar implementation.",
      emissions: {
        total: 25000,
        industrial: 5000,
        residential: 15000,
        transport: 5000
      }
    },
    {
      position: [28.6659, 77.1927],
      name: "Sarai Rohilla",
      insight: "Industrial zone with consistent high energy demand. Opportunities for energy efficiency improvements in manufacturing processes.",
      emissions: {
        total: 45000,
        industrial: 30000,
        residential: 5000,
        transport: 10000
      }
    },
    {
      position: [28.6457, 77.1634],
      name: "West Patel Nagar",
      insight: "Mixed commercial-residential area showing moderate energy usage. Good candidate for smart metering solutions.",
      emissions: {
        total: 30000,
        industrial: 10000,
        residential: 12000,
        transport: 8000
      }
    },
    {
      position: [28.7009, 77.1318],
      name: "Pitampura",
      insight: "Growing commercial hub with increasing energy demands. Recommended for grid modernization and demand response programs.",
      emissions: {
        total: 35000,
        industrial: 15000,
        residential: 10000,
        transport: 10000
      }
    },
    {
      position: [28.6512, 77.1691],
      name: "New Patel Nagar",
      insight: "Residential area with emerging commercial spaces. Potential for community-based energy conservation initiatives.",
      emissions: {
        total: 28000,
        industrial: 8000,
        residential: 14000,
        transport: 6000
      }
    }
  ];

  useEffect(() => {
    const fetchCarbonPredictions = async () => {
      try {
        const locationsWithPredictions = await Promise.all(
          initialLocations.map(async (location) => {
            const predictions = await geminiService.predictCarbonEmissions(location.emissions);
            return {
              ...location,
              predictions
            };
          })
        );
        setLocationData(locationsWithPredictions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching carbon predictions:', error);
        setLocationData(initialLocations);
        setLoading(false);
      }
    };

    fetchCarbonPredictions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="500px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={12}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {locationData.map((location, index) => (
        <Marker
          key={index}
          position={location.position}
          icon={locationIcon}
        >
          <Popup>
            <div style={{ maxWidth: '300px' }}>
              <Typography variant="h6" gutterBottom>{location.name}</Typography>
              <Typography variant="body2" gutterBottom><strong>Current Emissions:</strong> {location.emissions.total} tCO₂e/year</Typography>
              
              {location.predictions && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                    <strong>Predicted Emissions (1 Year):</strong>
                  </Typography>
                  <Typography variant="body2">
                    Total: {location.predictions.predictions.oneYear.total} tCO₂e
                  </Typography>
                  <Typography variant="body2">
                    Confidence: {Math.round(location.predictions.predictions.oneYear.confidence * 100)}%
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                    <strong>Key Recommendations:</strong>
                  </Typography>
                  {location.predictions.recommendations.map((rec, idx) => (
                    <Typography key={idx} variant="body2">
                      • {rec.action} ({rec.priority} priority)
                    </Typography>
                  ))}
                </>
              )}
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                <strong>AI Insight:</strong>
              </Typography>
              <Typography variant="body2">{location.insight}</Typography>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DelhiMap;
