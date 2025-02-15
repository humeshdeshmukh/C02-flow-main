import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;

// Create custom icons for different types of locations
const collegeIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const industrialIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ShegaonMap = () => {
  // Coordinates for Shri Sant Gajanan Maharaj College of Engineering, Shegaon
  const collegePosition = [20.7929, 76.6994];
  
  // Coordinates for industrial areas in Shegaon
  const industrialAreas = [
    {
      position: [20.7850, 76.6920],
      name: "MIDC Industrial Area",
      description: "Maharashtra Industrial Development Corporation Area"
    },
    {
      position: [20.7880, 76.6850],
      name: "Shegaon Industrial Estate",
      description: "Small Scale Industries Complex"
    },
    {
      position: [20.7950, 76.7050],
      name: "Agro Processing Zone",
      description: "Agricultural Products Processing Units"
    },
    {
      position: [20.7890, 76.6980],
      name: "Textile Manufacturing Hub",
      description: "Cotton and Textile Manufacturing Units"
    }
  ];
  
  return (
    <MapContainer 
      center={collegePosition} 
      zoom={14} 
      style={{ height: '300px', width: '90%', borderRadius: '12px', margin: '0 auto' }}
      zoomControl={false}
      dragging={false}
      touchZoom={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* College Marker */}
      <Marker position={collegePosition} icon={collegeIcon}>
        <Popup>
          <div>
            <h3>Shri Sant Gajanan Maharaj College of Engineering</h3>
            <p>Shegaon, Maharashtra</p>
          </div>
        </Popup>
      </Marker>

      {/* Industrial Area Markers */}
      {industrialAreas.map((area, index) => (
        <Marker 
          key={index} 
          position={area.position} 
          icon={industrialIcon}
        >
          <Popup>
            <div>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ShegaonMap;
