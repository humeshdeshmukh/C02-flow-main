import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key and create AI instance
const getAIInstance = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  console.log('API Key status:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please make sure REACT_APP_GEMINI_API_KEY is set in your .env file.');
  }

  // Log the first few characters of the API key for debugging (safely)
  console.log('API Key prefix:', apiKey.substring(0, 4) + '...');
  
  return new GoogleGenerativeAI(apiKey);
};

// Utility function to create a chat session
const createChatSession = async () => {
  try {
    const genAI = getAIInstance();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    return model.startChat({
      history: [
        {
          role: 'user',
          parts: 'You are an expert in carbon emissions analysis and environmental sustainability. Please provide detailed, data-driven insights.',
        },
        {
          role: 'model',
          parts: 'I understand my role as an environmental sustainability expert. I will analyze carbon emissions data and provide actionable insights based on current industry standards and best practices.',
        },
      ],
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to initialize AI chat session. Please check your API key and try again.');
  }
};

// Helper function to handle AI responses
const handleAIResponse = async (chat, prompt) => {
  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error in AI response:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing API key. Please check your configuration.');
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
};

// Local emission analysis service
const generateInsights = (data) => {
  const totalEmissions = Object.values(data).reduce((total, scope) => {
    return total + Object.values(scope).reduce((scopeTotal, item) => {
      return scopeTotal + (item.value || 0);
    }, 0);
  }, 0);

  const trends = [
    `Total emissions: ${totalEmissions.toFixed(2)} kg CO2e`,
    `Scope 1 emissions account for ${((data.scope1.fuelConsumption.value / totalEmissions) * 100).toFixed(1)}% of total emissions`,
    `Scope 2 emissions account for ${((data.scope2.electricityUsage.value / totalEmissions) * 100).toFixed(1)}% of total emissions`,
    `Scope 3 emissions account for ${((data.scope3.businessTravel.value / totalEmissions) * 100).toFixed(1)}% of total emissions`,
  ];

  return {
    trends,
    hotspots: [
      {
        area: 'Fuel Consumption',
        impact: 'High',
        recommendation: 'Consider transitioning to electric vehicles or renewable fuel sources'
      },
      {
        area: 'Electricity Usage',
        impact: 'Medium',
        recommendation: 'Implement energy-efficient lighting and equipment'
      },
      {
        area: 'Business Travel',
        impact: 'Low',
        recommendation: 'Promote virtual meetings and local business partnerships'
      }
    ],
    benchmarking: {
      industry: 'Average',
      performance: 'Within expected range',
      percentile: 65
    }
  };
};

export const getEmissionInsights = async (emissionData) => {
  try {
    if (!emissionData) {
      throw new Error('No emission data provided for analysis.');
    }
    return generateInsights(emissionData);
  } catch (error) {
    console.error('Error getting emission insights:', error);
    throw error;
  }
};

export const generateReductionStrategies = async (emissionData) => {
  try {
    if (!emissionData) {
      throw new Error('No emission data provided for strategy generation.');
    }

    return {
      shortTerm: {
        strategies: [
          {
            action: 'Implement LED lighting throughout facilities',
            impact: 'Medium',
            roi: '6-12 months',
            complexity: 'Low',
            cost: 'Low'
          },
          {
            action: 'Optimize HVAC schedules',
            impact: 'High',
            roi: '3-6 months',
            complexity: 'Low',
            cost: 'Low'
          }
        ]
      },
      mediumTerm: {
        strategies: [
          {
            action: 'Install solar panels',
            impact: 'High',
            roi: '2-4 years',
            complexity: 'Medium',
            cost: 'High'
          },
          {
            action: 'Upgrade to electric vehicle fleet',
            impact: 'High',
            roi: '3-5 years',
            complexity: 'Medium',
            cost: 'High'
          }
        ]
      },
      longTerm: {
        strategies: [
          {
            action: 'Achieve carbon neutrality',
            impact: 'Very High',
            roi: '5+ years',
            complexity: 'High',
            cost: 'Very High'
          },
          {
            action: 'Implement circular economy practices',
            impact: 'High',
            roi: '4-6 years',
            complexity: 'High',
            cost: 'Medium'
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error generating reduction strategies:', error);
    throw error;
  }
};

export const predictFutureEmissions = async (historicalData) => {
  try {
    if (!historicalData) {
      throw new Error('No historical data provided for prediction.');
    }

    const baseEmission = Object.values(historicalData).reduce((total, scope) => {
      return total + Object.values(scope).reduce((scopeTotal, item) => {
        return scopeTotal + (item.value || 0);
      }, 0);
    }, 0);

    // Generate 12 months of forecast data
    const forecast = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() + i);
      const predicted = baseEmission * (1 - (i * 0.02)); // Assume 2% reduction per month
      return {
        month: month.toLocaleString('default', { month: 'short', year: 'numeric' }),
        predicted: predicted,
        upperBound: predicted * 1.1,
        lowerBound: predicted * 0.9
      };
    });

    return {
      forecast,
      factors: [
        { name: 'Energy Efficiency Improvements', impact: 'High positive impact' },
        { name: 'Business Growth', impact: 'Moderate negative impact' },
        { name: 'Seasonal Variations', impact: 'Low impact' }
      ],
      scenarios: [
        {
          name: 'Business as Usual',
          description: 'Continue current practices',
          prediction: baseEmission * 0.9
        },
        {
          name: 'Aggressive Reduction',
          description: 'Implement all proposed measures',
          prediction: baseEmission * 0.6
        }
      ]
    };
  } catch (error) {
    console.error('Error predicting future emissions:', error);
    throw error;
  }
};

export const generateSustainabilityReport = async (allData) => {
  try {
    if (!allData) {
      throw new Error('No data provided for sustainability report generation.');
    }

    const totalEmissions = Object.values(allData.emissions).reduce((total, scope) => {
      return total + Object.values(scope).reduce((scopeTotal, item) => {
        return scopeTotal + (item.value || 0);
      }, 0);
    }, 0);

    return {
      executiveSummary: {
        keyFindings: [
          'Overall emissions are within industry average',
          'Significant reduction potential in energy usage',
          'Strong opportunity for renewable energy adoption',
          'Supply chain optimization could yield 15% reduction'
        ],
        challenges: [
          'Initial investment requirements',
          'Technical implementation complexity',
          'Staff training needs'
        ],
        recommendations: [
          'Prioritize energy efficiency projects',
          'Develop renewable energy transition plan',
          'Implement employee awareness programs'
        ]
      },
      emissionAnalysis: {
        total: totalEmissions,
        breakdown: [
          {
            category: 'Scope 1',
            value: allData.emissions.scope1.fuelConsumption.value,
            percentage: (allData.emissions.scope1.fuelConsumption.value / totalEmissions) * 100
          },
          {
            category: 'Scope 2',
            value: allData.emissions.scope2.electricityUsage.value,
            percentage: (allData.emissions.scope2.electricityUsage.value / totalEmissions) * 100
          },
          {
            category: 'Scope 3',
            value: allData.emissions.scope3.businessTravel.value,
            percentage: (allData.emissions.scope3.businessTravel.value / totalEmissions) * 100
          }
        ]
      },
      riskAssessment: {
        metrics: [
          { category: 'Regulatory Risk', value: 65 },
          { category: 'Market Risk', value: 45 },
          { category: 'Physical Risk', value: 30 },
          { category: 'Reputational Risk', value: 55 },
          { category: 'Technology Risk', value: 40 }
        ]
      }
    };
  } catch (error) {
    console.error('Error generating sustainability report:', error);
    throw error;
  }
};

export const analyzeSupplyChain = async (supplyChainData) => {
  try {
    if (!supplyChainData) {
      throw new Error('No supply chain data provided for analysis.');
    }

    return {
      hotspots: [
        {
          area: 'Transportation',
          emissionLevel: 'High',
          priority: 'High',
          action: 'Optimize delivery routes and transition to electric vehicles'
        },
        {
          area: 'Warehousing',
          emissionLevel: 'Medium',
          priority: 'Medium',
          action: 'Implement energy-efficient lighting and HVAC systems'
        },
        {
          area: 'Packaging',
          emissionLevel: 'Low',
          priority: 'Low',
          action: 'Switch to recyclable and biodegradable materials'
        }
      ],
      suppliers: [
        {
          name: 'Supplier A',
          emissions: 1200,
          risk: 'High'
        },
        {
          name: 'Supplier B',
          emissions: 800,
          risk: 'Medium'
        },
        {
          name: 'Supplier C',
          emissions: 400,
          risk: 'Low'
        }
      ],
      recommendations: [
        {
          action: 'Implement green logistics program',
          impact: 'High',
          timeline: '12 months'
        },
        {
          action: 'Develop supplier sustainability scorecard',
          impact: 'Medium',
          timeline: '6 months'
        }
      ]
    };
  } catch (error) {
    console.error('Error analyzing supply chain:', error);
    throw error;
  }
};

export const generateComplianceReport = async (emissionData, region) => {
  try {
    if (!emissionData || !region) {
      throw new Error('Missing emission data or region for compliance report.');
    }

    return {
      requirements: [
        {
          requirement: 'GHG Emissions Reporting',
          status: 'On Track',
          compliance: true,
          action: 'Continue current reporting practices'
        },
        {
          requirement: 'Energy Efficiency Standards',
          status: 'Needs Improvement',
          compliance: false,
          action: 'Upgrade facility equipment to meet standards'
        },
        {
          requirement: 'Renewable Energy Targets',
          status: 'At Risk',
          compliance: false,
          action: 'Develop renewable energy implementation plan'
        }
      ],
      risks: [
        {
          description: 'Increasing carbon pricing',
          severity: 'High',
          mitigation: 'Accelerate emission reduction initiatives'
        },
        {
          description: 'Stricter reporting requirements',
          severity: 'Medium',
          mitigation: 'Enhance data collection systems'
        }
      ],
      timeline: [
        {
          deadline: '2025-Q4',
          action: 'Complete efficiency upgrades',
          status: 'In Progress'
        },
        {
          deadline: '2026-Q2',
          action: 'Achieve 25% renewable energy',
          status: 'Planned'
        }
      ]
    };
  } catch (error) {
    console.error('Error generating compliance report:', error);
    throw error;
  }
};
