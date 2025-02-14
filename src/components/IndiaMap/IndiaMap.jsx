import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleQuantile } from 'd3-scale';
import indiaMap from '../../data/maps/india.json';
import './IndiaMap.css';
import BeeTrail from '../BeeTrail';

const stateData = {
  "Andhra Pradesh": { energyDemand: 40000, energyConsumption: 38000, renewableShare: 38, peakLoad: 35000 },
  "Arunachal Pradesh": { energyDemand: 15000, energyConsumption: 14000, renewableShare: 45, peakLoad: 12000 },
  "Assam": { energyDemand: 28000, energyConsumption: 26000, renewableShare: 20, peakLoad: 24000 },
  "Bihar": { energyDemand: 32000, energyConsumption: 30000, renewableShare: 20, peakLoad: 28000 },
  "Chhattisgarh": { energyDemand: 33000, energyConsumption: 31000, renewableShare: 25, peakLoad: 28000 },
  "Delhi": { energyDemand: 30000, energyConsumption: 28000, renewableShare: 15, peakLoad: 26000 },
  "Goa": { energyDemand: 15000, energyConsumption: 14000, renewableShare: 30, peakLoad: 12000 },
  "Gujarat": { energyDemand: 38000, energyConsumption: 36000, renewableShare: 30, peakLoad: 32000 },
  "Haryana": { energyDemand: 35000, energyConsumption: 33000, renewableShare: 28, peakLoad: 30000 },
  "Himachal Pradesh": { energyDemand: 22000, energyConsumption: 20000, renewableShare: 40, peakLoad: 18000 },
  "Jammu and Kashmir": { energyDemand: 25000, energyConsumption: 23000, renewableShare: 35, peakLoad: 21000 },
  "Jharkhand": { energyDemand: 31000, energyConsumption: 29000, renewableShare: 22, peakLoad: 27000 },
  "Karnataka": { energyDemand: 35000, energyConsumption: 33000, renewableShare: 35, peakLoad: 30000 },
  "Kerala": { energyDemand: 30000, energyConsumption: 28000, renewableShare: 32, peakLoad: 26000 },
  "Madhya Pradesh": { energyDemand: 36000, energyConsumption: 34000, renewableShare: 28, peakLoad: 31000 },
  "Maharashtra": { energyDemand: 45000, energyConsumption: 42000, renewableShare: 25, peakLoad: 38000 },
  "Manipur": { energyDemand: 16000, energyConsumption: 15000, renewableShare: 30, peakLoad: 13000 },
  "Meghalaya": { energyDemand: 20000, energyConsumption: 18000, renewableShare: 25, peakLoad: 16000 },
  "Mizoram": { energyDemand: 14000, energyConsumption: 13000, renewableShare: 35, peakLoad: 11000 },
  "Nagaland": { energyDemand: 15000, energyConsumption: 14000, renewableShare: 30, peakLoad: 12000 },
  "Odisha": { energyDemand: 34000, energyConsumption: 32000, renewableShare: 30, peakLoad: 29000 },
  "Punjab": { energyDemand: 33000, energyConsumption: 31000, renewableShare: 25, peakLoad: 28000 },
  "Rajasthan": { energyDemand: 39000, energyConsumption: 37000, renewableShare: 45, peakLoad: 34000 },
  "Sikkim": { energyDemand: 12000, energyConsumption: 11000, renewableShare: 40, peakLoad: 10000 },
  "Tamil Nadu": { energyDemand: 42000, energyConsumption: 40000, renewableShare: 40, peakLoad: 36000 },
  "Telangana": { energyDemand: 37000, energyConsumption: 35000, renewableShare: 35, peakLoad: 32000 },
  "Tripura": { energyDemand: 17000, energyConsumption: 16000, renewableShare: 25, peakLoad: 14000 },
  "Uttar Pradesh": { energyDemand: 48000, energyConsumption: 45000, renewableShare: 22, peakLoad: 42000 },
  "Uttarakhand": { energyDemand: 25000, energyConsumption: 23000, renewableShare: 35, peakLoad: 21000 },
  "West Bengal": { energyDemand: 41000, energyConsumption: 39000, renewableShare: 28, peakLoad: 36000 },
  // Union Territories
  "Andaman and Nicobar Islands": { energyDemand: 8000, energyConsumption: 7000, renewableShare: 20, peakLoad: 6000 },
  "Chandigarh": { energyDemand: 10000, energyConsumption: 9000, renewableShare: 15, peakLoad: 8000 },
  "Dadra and Nagar Haveli": { energyDemand: 9000, energyConsumption: 8000, renewableShare: 18, peakLoad: 7000 },
  "Daman and Diu": { energyDemand: 8500, energyConsumption: 7500, renewableShare: 20, peakLoad: 6500 },
  "Lakshadweep": { energyDemand: 5000, energyConsumption: 4500, renewableShare: 25, peakLoad: 4000 },
  "Puducherry": { energyDemand: 11000, energyConsumption: 10000, renewableShare: 22, peakLoad: 9000 }
};

const IndiaMap = ({ onStateSelect, selectedMetric = 'energyDemand' }) => {
  const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 2.5 });
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const colorScale = scaleQuantile()
    .domain(Object.values(stateData).map(d => d[selectedMetric]))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618"
    ]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '550px' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 600,
          center: [78.9629, 22.5937]
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
          maxZoom={8}
          minZoom={1.5}
        >
          <Geographies geography={indiaMap}>
            {({ geographies }) =>
              geographies.map(geo => {
                const stateName = geo.properties.name;
                const data = stateData[stateName] || {};
                const value = data[selectedMetric] || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      onStateSelect(stateName, data);
                    }}
                    onMouseEnter={(evt) => {
                      const { pageX, pageY } = evt;
                      setTooltipContent(`${stateName}: ${value.toLocaleString()} MW`);
                      setTooltipPosition({ x: pageX, y: pageY });
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: {
                        fill: data ? colorScale(value) : '#EEE',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: data ? colorScale(value) : '#EEE',
                        stroke: '#FFFFFF',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: 'pointer'
                      },
                      pressed: {
                        fill: data ? colorScale(value) : '#EEE',
                        stroke: '#FFFFFF',
                        strokeWidth: 1,
                        outline: 'none',
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltipContent && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 40,
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#FFD180',
            borderRadius: '4px',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 1000,
            border: '1px solid #FFD180'
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
