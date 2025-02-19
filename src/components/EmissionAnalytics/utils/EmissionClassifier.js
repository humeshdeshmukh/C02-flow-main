// Emission factors and constants
const EMISSION_FACTORS = {
  electricity: {
    coal: 0.94, // kg CO2e per kWh
    natural_gas: 0.37,
    renewable: 0,
  },
  fuel: {
    petrol: 2.31, // kg CO2e per liter
    diesel: 2.68,
    lpg: 1.51,
  },
  transport: {
    car: 0.14, // kg CO2e per km
    bus: 0.08,
    train: 0.04,
    plane: 0.25,
  },
};

// Criteria-based classification rules
const CLASSIFICATION_CRITERIA = {
  scope1: {
    conditions: [
      { type: 'fuel_consumption', threshold: 1000 },
      { type: 'direct_emissions', threshold: 500 },
    ],
    factors: ['fuel type', 'equipment efficiency', 'operational hours'],
  },
  scope2: {
    conditions: [
      { type: 'electricity_usage', threshold: 5000 },
      { type: 'heating_cooling', threshold: 2000 },
    ],
    factors: ['energy source', 'grid emission factor', 'seasonal variations'],
  },
  scope3: {
    conditions: [
      { type: 'business_travel', threshold: 10000 },
      { type: 'waste_disposal', threshold: 1000 },
    ],
    factors: ['transport mode', 'distance', 'waste type'],
  },
};

// Formula-based calculations
export const calculateEmissions = {
  electricity: (usage, sourceType = 'coal') => {
    return usage * EMISSION_FACTORS.electricity[sourceType];
  },

  fuel: (consumption, fuelType = 'petrol') => {
    return consumption * EMISSION_FACTORS.fuel[fuelType];
  },

  transport: (distance, mode = 'car') => {
    return distance * EMISSION_FACTORS.transport[mode];
  },
};

// Criteria-based classification
export const classifyEmission = (data) => {
  const { type, value, factors = {} } = data;
  let scope = 'scope3'; // Default classification
  let confidence = 0.7;
  let details = { factors: [], recommendations: [] };

  // Check scope1 criteria
  if (
    (type === 'fuel_consumption' && value > CLASSIFICATION_CRITERIA.scope1.conditions[0].threshold) ||
    (type === 'direct_emissions' && value > CLASSIFICATION_CRITERIA.scope1.conditions[1].threshold)
  ) {
    scope = 'scope1';
    confidence = 0.9;
    details.factors = CLASSIFICATION_CRITERIA.scope1.factors;
  }
  // Check scope2 criteria
  else if (
    (type === 'electricity_usage' && value > CLASSIFICATION_CRITERIA.scope2.conditions[0].threshold) ||
    (type === 'heating_cooling' && value > CLASSIFICATION_CRITERIA.scope2.conditions[1].threshold)
  ) {
    scope = 'scope2';
    confidence = 0.85;
    details.factors = CLASSIFICATION_CRITERIA.scope2.factors;
  }

  // Generate recommendations based on classification
  details.recommendations = generateRecommendations(scope, value, factors);

  return {
    scope,
    confidence,
    details,
  };
};

// Helper function to generate recommendations
const generateRecommendations = (scope, value, factors) => {
  const recommendations = [];

  switch (scope) {
    case 'scope1':
      if (factors.fuel_type === 'petrol') {
        recommendations.push('Consider switching to electric vehicles or hybrid options');
      }
      if (value > 1500) {
        recommendations.push('Implement fuel efficiency monitoring system');
      }
      break;

    case 'scope2':
      recommendations.push('Consider renewable energy sources');
      if (value > 6000) {
        recommendations.push('Conduct energy audit');
        recommendations.push('Implement energy management system');
      }
      break;

    case 'scope3':
      recommendations.push('Develop sustainable travel policy');
      recommendations.push('Consider video conferencing alternatives');
      break;
  }

  return recommendations;
};

export default {
  calculateEmissions,
  classifyEmission,
  EMISSION_FACTORS,
  CLASSIFICATION_CRITERIA,
};
