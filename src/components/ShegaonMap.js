import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ShegaonMap = () => {
  // Coordinates for Shri Sant Gajanan Maharaj College of Engineering, Shegaon
  const collegePosition = [20.7929, 76.6994]; // Update these coordinates with exact college location
  
  return (
    <MapContainer 
      center={collegePosition} 
      zoom={15} 
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={collegePosition}>
        <Popup>
          <div>
            <h3>Shri Sant Gajanan Maharaj College of Engineering</h3>
            <p>Shegaon, Maharashtra</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default ShegaonMap;
