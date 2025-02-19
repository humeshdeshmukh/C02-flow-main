import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_CONFIG } from '../config/apiConfig';
import { extractJsonFromResponse, isValidWeatherImpactResponse } from '../utils/apiUtils';

// Debug environment variables
console.log('Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  HAS_API_KEY: !!process.env.REACT_APP_GEMINI_API_KEY,
  API_KEY_LENGTH: process.env.REACT_APP_GEMINI_API_KEY?.length || 0,
  CONFIG_KEY_LENGTH: API_CONFIG.GEMINI_API_KEY?.length || 0
});

// Initialize Gemini AI with environment variable
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Gemini API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to make API calls with proper error handling
const makeGeminiApiCall = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in makeGeminiApiCall:', error);
    throw error;
  }
};

const extractJsonFromText = (text) => {
  try {
    // First try: direct JSON parse
    return JSON.parse(text);
  } catch (e) {
    try {
      // Second try: find JSON-like structure
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  }
  throw new Error('No valid JSON found in response');
};

const geminiService = {
  // Predict energy price based on market conditions
  async predictEnergyPrice(marketData) {
    try {
      const prompt = `
        Given the following energy market conditions:
        - Current demand: ${marketData.demand}kW
        - Supply availability: ${marketData.supply}kW
        - Time of day: ${marketData.timeOfDay}
        - Weather conditions: ${marketData.weather}
        - Historical average price: ${marketData.historicalPrice} credits/kWh
        
        Predict the optimal energy price per kWh for the next hour. Consider:
        1. Supply-demand ratio
        2. Peak/off-peak hours
        3. Weather impact on renewable energy
        4. Market trends
        
        Return a JSON object with the following structure ONLY (no markdown, no explanation):
        {
          "predictedPrice": number,
          "confidence": number
        }`;

      console.log('Making energy price prediction request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const predictions = extractJsonFromText(responseText);
      console.log('Successfully parsed predictions:', {
        hasPredictedPrice: !!predictions?.predictedPrice,
        confidence: predictions?.confidence
      });

      if (!predictions || !predictions.predictedPrice || !predictions.confidence) {
        throw new Error('Invalid response format from Gemini API');
      }

      return predictions;
    } catch (error) {
      console.error('Error in predictEnergyPrice:', {
        error: error.message,
        stack: error.stack,
        marketData
      });
      throw error;
    }
  },

  // Generate personalized trading recommendations
  async getTradingRecommendations(userProfile, marketConditions) {
    try {
      const prompt = `Based on the following market conditions and user profile, generate a trading recommendation.
Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "action": "buy" or "sell" or "wait",
  "amount": number,
  "price": number,
  "reasoning": "string",
  "timing": "immediate" or "wait",
  "confidence": number
}

Market Conditions:
- Average Price: ${marketConditions.averagePrice} Credits/kWh
- Market Trend: ${marketConditions.trend}
- Peak Hour: ${marketConditions.isPeakHour ? 'Yes' : 'No'}
- Demand Forecast: ${marketConditions.demandForecast}

User Profile:
- Available Energy: ${userProfile.availableEnergy} kWh
- Trading Power: ${userProfile.tradingPower} Credits
- Risk Tolerance: ${userProfile.riskTolerance || 'Moderate'}`;

      console.log('Making trading recommendations request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const recommendations = extractJsonFromText(responseText);
      console.log('Successfully parsed recommendations:', {
        hasAction: !!recommendations?.action,
        amount: recommendations?.amount,
        price: recommendations?.price,
        reasoning: recommendations?.reasoning,
        timing: recommendations?.timing,
        confidence: recommendations?.confidence
      });

      if (!recommendations || !recommendations.action || !recommendations.amount || !recommendations.price || !recommendations.reasoning || !recommendations.timing || !recommendations.confidence) {
        throw new Error('Invalid response format from Gemini API');
      }

      return recommendations;
    } catch (error) {
      console.error('Error in getTradingRecommendations:', {
        error: error.message,
        stack: error.stack,
        userProfile,
        marketConditions
      });
      throw error;
    }
  },

  // Analyze transaction risk
  async analyzeTransactionRisk(transaction, userHistory) {
    try {
      const prompt = `
        Analyze the risk level of the following energy trading transaction:
        
        Transaction Details:
        - Type: ${transaction.type}
        - Amount: ${transaction.amount}kWh
        - Price per kWh: ${transaction.price} credits
        - Counterparty rating: ${transaction.counterpartyRating}/5
        
        User Trading History:
        - Total transactions: ${userHistory.totalTransactions}
        - Successful transactions: ${userHistory.successfulTransactions}
        - Average transaction size: ${userHistory.averageSize}kWh
        - Risk tolerance: ${userHistory.riskTolerance}/5
        
        Provide a risk assessment in the following JSON format:
        {
          "riskLevel": "low|medium|high",
          "riskScore": "0-100",
          "concerns": ["list of specific risk factors"],
          "recommendations": ["list of risk mitigation steps"],
          "proceedRecommended": boolean
        }
      `;

      console.log('Making transaction risk analysis request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const riskAssessment = extractJsonFromText(responseText);
      console.log('Successfully parsed risk assessment:', {
        riskLevel: riskAssessment?.riskLevel,
        riskScore: riskAssessment?.riskScore,
        concerns: riskAssessment?.concerns,
        recommendations: riskAssessment?.recommendations,
        proceedRecommended: riskAssessment?.proceedRecommended
      });

      if (!riskAssessment || !riskAssessment.riskLevel || !riskAssessment.riskScore || !riskAssessment.concerns || !riskAssessment.recommendations || !riskAssessment.proceedRecommended) {
        throw new Error('Invalid response format from Gemini API');
      }

      return riskAssessment;
    } catch (error) {
      console.error('Error in analyzeTransactionRisk:', {
        error: error.message,
        stack: error.stack,
        transaction,
        userHistory
      });
      throw error;
    }
  },

  // Generate smart contract terms
  async generateSmartContractTerms(transaction) {
    try {
      const prompt = `
        Generate smart contract terms for the following P2P energy trading transaction:
        
        Transaction Details:
        - Seller: ${transaction.seller}
        - Buyer: ${transaction.buyer}
        - Energy amount: ${transaction.amount}kWh
        - Price per kWh: ${transaction.price} credits
        - Delivery period: ${transaction.deliveryPeriod}
        - Energy type: ${transaction.energyType}
        
        Generate contract terms in the following JSON format:
        {
          "contractId": "unique identifier",
          "terms": ["list of specific contract terms"],
          "conditions": ["list of conditions"],
          "penalties": ["list of penalty clauses"],
          "validityPeriod": "duration in hours",
          "qualityRequirements": ["list of energy quality requirements"],
          "disputeResolution": "dispute resolution process"
        }
      `;

      console.log('Making smart contract terms request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const contractTerms = extractJsonFromText(responseText);
      console.log('Successfully parsed contract terms:', {
        contractId: contractTerms?.contractId,
        terms: contractTerms?.terms,
        conditions: contractTerms?.conditions,
        penalties: contractTerms?.penalties,
        validityPeriod: contractTerms?.validityPeriod,
        qualityRequirements: contractTerms?.qualityRequirements,
        disputeResolution: contractTerms?.disputeResolution
      });

      if (!contractTerms || !contractTerms.contractId || !contractTerms.terms || !contractTerms.conditions || !contractTerms.penalties || !contractTerms.validityPeriod || !contractTerms.qualityRequirements || !contractTerms.disputeResolution) {
        throw new Error('Invalid response format from Gemini API');
      }

      return contractTerms;
    } catch (error) {
      console.error('Error in generateSmartContractTerms:', {
        error: error.message,
        stack: error.stack,
        transaction
      });
      throw error;
    }
  },

  // Generate order book data
  async generateOrderBook(marketData) {
    try {
      const prompt = `Generate a realistic order book for energy trading based on these market conditions:
Current Price: ${marketData.currentPrice} Credits/kWh
Market Trend: ${marketData.marketTrend}
Peak Hour: ${marketData.peakHourDemand ? 'Yes' : 'No'}
Supply: ${marketData.supply} kWh
Demand: ${marketData.demand} kWh

Generate 10 buy orders and 10 sell orders around the current price.
Return the data as a valid JSON object with this exact structure:
{
  "buyOrders": [
    {"price": number, "amount": number}
  ],
  "sellOrders": [
    {"price": number, "amount": number}
  ]
}

The response should be ONLY the JSON object, nothing else.`;

      console.log('Making order book request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const orderBook = extractJsonFromText(responseText);
      console.log('Successfully parsed order book:', {
        buyOrders: orderBook?.buyOrders,
        sellOrders: orderBook?.sellOrders
      });

      if (!orderBook || !orderBook.buyOrders || !orderBook.sellOrders) {
        throw new Error('Invalid response format from Gemini API');
      }

      return orderBook;
    } catch (error) {
      console.error('Error in generateOrderBook:', {
        error: error.message,
        stack: error.stack,
        marketData
      });
      throw error;
    }
  },

  // Predict load management for states
  async predictLoadManagement(stateData) {
    try {
      const prompt = `
        Analyze the following state energy data and predict load management metrics:
        State: ${stateData.name}
        Current Load: ${stateData.currentLoad} MW
        Peak Capacity: ${stateData.peakCapacity} MW
        Time: ${stateData.timestamp}
        Weather: ${stateData.weather}
        Historical Usage Pattern: ${stateData.historicalPattern}

        Provide a detailed analysis of:
        1. Expected load for next 24 hours
        2. Load distribution across sectors
        3. Peak load times
        4. Load shedding requirements if any
        5. Efficiency recommendations

        Format the response as a structured JSON object.
      `;

      console.log('Making load management prediction request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const loadManagement = extractJsonFromText(responseText);
      console.log('Successfully parsed load management:', {
        expectedLoad: loadManagement?.expectedLoad,
        loadDistribution: loadManagement?.loadDistribution,
        peakLoadTimes: loadManagement?.peakLoadTimes,
        loadSheddingRequirements: loadManagement?.loadSheddingRequirements,
        efficiencyRecommendations: loadManagement?.efficiencyRecommendations
      });

      if (!loadManagement || !loadManagement.expectedLoad || !loadManagement.loadDistribution || !loadManagement.peakLoadTimes || !loadManagement.loadSheddingRequirements || !loadManagement.efficiencyRecommendations) {
        throw new Error('Invalid response format from Gemini API');
      }

      return loadManagement;
    } catch (error) {
      console.error('Error in predictLoadManagement:', {
        error: error.message,
        stack: error.stack,
        stateData
      });
      throw error;
    }
  },

  // Get active nodes analysis
  async getActiveNodesAnalysis(stateData) {
    try {
      const prompt = `
        Analyze the active energy nodes for the state:
        State: ${stateData.name}
        Total Nodes: ${stateData.totalNodes}
        Active Nodes: ${stateData.activeNodes}
        Node Types: ${JSON.stringify(stateData.nodeTypes)}
        Network Health: ${stateData.networkHealth}

        Provide analysis of:
        1. Node activity patterns
        2. Network stability
        3. Node distribution efficiency
        4. Performance metrics
        5. Optimization recommendations

        Return as a structured JSON object.
      `;

      console.log('Making active nodes analysis request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const activeNodesAnalysis = extractJsonFromText(responseText);
      console.log('Successfully parsed active nodes analysis:', {
        nodeActivityPatterns: activeNodesAnalysis?.nodeActivityPatterns,
        networkStability: activeNodesAnalysis?.networkStability,
        nodeDistributionEfficiency: activeNodesAnalysis?.nodeDistributionEfficiency,
        performanceMetrics: activeNodesAnalysis?.performanceMetrics,
        optimizationRecommendations: activeNodesAnalysis?.optimizationRecommendations
      });

      if (!activeNodesAnalysis || !activeNodesAnalysis.nodeActivityPatterns || !activeNodesAnalysis.networkStability || !activeNodesAnalysis.nodeDistributionEfficiency || !activeNodesAnalysis.performanceMetrics || !activeNodesAnalysis.optimizationRecommendations) {
        throw new Error('Invalid response format from Gemini API');
      }

      return activeNodesAnalysis;
    } catch (error) {
      console.error('Error in getActiveNodesAnalysis:', {
        error: error.message,
        stack: error.stack,
        stateData
      });
      throw error;
    }
  },

  // Generate state energy overview
  async getStateEnergyOverview(stateData) {
    // Calculate default energy mix based on renewable percentage
    const renewablePercentage = stateData.renewablePercentage || 0;
    const thermalPercentage = 100 - renewablePercentage;
    
    // Split renewable percentage among solar, wind, and hydro
    const solarShare = Math.round(renewablePercentage * 0.4); // 40% of renewables
    const windShare = Math.round(renewablePercentage * 0.35); // 35% of renewables
    const hydroShare = Math.round(renewablePercentage * 0.25); // 25% of renewables

    try {
      const prompt = `You are an AI energy analyst. Analyze the following state energy data and provide insights in a structured JSON format.
      
State Data:
- Name: ${stateData.name || 'Unknown'}
- Total Generation: ${stateData.totalGeneration || 0} MW
- Renewable Percentage: ${renewablePercentage}%
- Grid Stability: ${stateData.gridStability || 90}%
- Energy Storage: ${stateData.energyStorage || 0} MWh
- Carbon Footprint: ${stateData.carbonFootprint || 0}

Default Energy Mix (if no better data available):
- Solar: ${solarShare}%
- Wind: ${windShare}%
- Hydro: ${hydroShare}%
- Thermal: ${thermalPercentage}%

IMPORTANT: Respond ONLY with a valid JSON object. The energyMixDistribution MUST always contain non-null percentage values for solar, wind, hydro, and thermal that sum to 100%.

{
  "energyMixDistribution": {
    "solar": "${solarShare}",
    "wind": "${windShare}",
    "hydro": "${hydroShare}",
    "thermal": "${thermalPercentage}"
  },
  "sustainabilityIndicators": {
    "carbonIntensity": "Medium - 450g CO2/kWh",
    "waterUsage": "Moderate - 2.5L/kWh",
    "landImpact": "Low - Well-optimized solar farms"
  },
  "futureEnergyProjections": {
    "2025Demand": "Expected 15% increase",
    "RenewableGrowth": "Solar capacity to double",
    "GridModernization": "Smart grid implementation by 2026"
  }
}`;

      console.log('Sending prompt to Gemini:', prompt);
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Raw response from Gemini:', responseText);
      
      const stateEnergyOverview = extractJsonFromText(responseText);
      console.log('Parsed response:', stateEnergyOverview);

      // Validate response structure and ensure no null values in energy mix
      if (!stateEnergyOverview.energyMixDistribution ||
          !stateEnergyOverview.sustainabilityIndicators ||
          !stateEnergyOverview.futureEnergyProjections) {
        throw new Error('Invalid response format: Missing required fields');
      }

      // Ensure energy mix values are never null
      const mix = stateEnergyOverview.energyMixDistribution;
      if (!mix.solar || !mix.wind || !mix.hydro || !mix.thermal) {
        stateEnergyOverview.energyMixDistribution = {
          solar: String(solarShare),
          wind: String(windShare),
          hydro: String(hydroShare),
          thermal: String(thermalPercentage)
        };
      }

      return stateEnergyOverview;
    } catch (error) {
      console.error('Error in getStateEnergyOverview:', error);
      // Return default values if there's an error
      return {
        energyMixDistribution: {
          solar: String(solarShare),
          wind: String(windShare),
          hydro: String(hydroShare),
          thermal: String(thermalPercentage)
        },
        sustainabilityIndicators: {
          carbonIntensity: "Medium - 450g CO2/kWh",
          waterUsage: "Moderate - 2.5L/kWh",
          landImpact: "Low - Well-optimized solar farms"
        },
        futureEnergyProjections: {
          "2025Demand": "Expected 15% increase",
          "RenewableGrowth": "Solar capacity to double",
          "GridModernization": "Smart grid implementation by 2026"
        }
      };
    }
  },

  // Predict electricity usage for states and regions
  async predictElectricityUsage(stateData, historicalData) {
    try {
      const prompt = `
        Given the following state/region energy data:
        - Current consumption: ${stateData.currentConsumption} MW
        - Historical average: ${historicalData.averageConsumption} MW
        - Peak load: ${stateData.peakLoad} MW
        - Time of day: ${new Date().getHours()}:00
        - Season: ${historicalData.season}
        - Industrial activity index: ${historicalData.industrialIndex}
        
        Predict:
        1. Expected consumption for next 24 hours
        2. Peak usage time
        3. Potential savings through optimization
        4. Regional impact on grid stability
        
        Return in JSON format:
        {
          "hourlyPredictions": [24 hourly values],
          "peakUsageTime": "HH:MM",
          "potentialSavings": "percentage",
          "gridStabilityImpact": "high/medium/low",
          "confidenceScore": 0-100
        }`;

      console.log('Making electricity usage prediction request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const electricityUsage = extractJsonFromText(responseText);
      console.log('Successfully parsed electricity usage:', {
        hourlyPredictions: electricityUsage?.hourlyPredictions,
        peakUsageTime: electricityUsage?.peakUsageTime,
        potentialSavings: electricityUsage?.potentialSavings,
        gridStabilityImpact: electricityUsage?.gridStabilityImpact,
        confidenceScore: electricityUsage?.confidenceScore
      });

      if (!electricityUsage || !electricityUsage.hourlyPredictions || !electricityUsage.peakUsageTime || !electricityUsage.potentialSavings || !electricityUsage.gridStabilityImpact || !electricityUsage.confidenceScore) {
        throw new Error('Invalid response format from Gemini API');
      }

      return electricityUsage;
    } catch (error) {
      console.error('Error in predictElectricityUsage:', {
        error: error.message,
        stack: error.stack,
        stateData,
        historicalData
      });
      throw error;
    }
  },

  // Chat with the AI assistant
  async chat(message, chatHistory = []) {
    try {
      const prompt = `You are an AI assistant for a smart energy grid platform called BioGrid. Your role is to help users understand and optimize their energy usage, trading, and environmental impact.

Key features you can assist with:
1. Energy Trading: Explain market conditions, trading strategies, and provide basic guidance
2. Load Management: Help users understand their energy consumption patterns
3. Climate Impact: Explain carbon footprint calculations and provide sustainability tips
4. Smart Grid: Explain how the smart grid works and its benefits
5. Energy Optimization: Provide tips for reducing energy usage and costs

Guidelines:
- Be concise but informative
- Use a professional yet friendly tone
- Focus on energy-related topics
- Provide specific, actionable advice when possible
- Express numerical data clearly
- If unsure, acknowledge limitations and suggest consulting official documentation

Current chat history:
${chatHistory.map(msg => `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}`).join('\n')}

User's latest message: ${message}

Respond in a helpful and informative way while staying within your role as a smart grid assistant.`;

      console.log('Making chat request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      return responseText;
    } catch (error) {
      console.error('Error in chat:', {
        error: error.message,
        stack: error.stack,
        message,
        chatHistory
      });
      throw error;
    }
  },

  // Predict load balancing recommendations
  async getLoadBalancingRecommendations(gridData) {
    try {
      const prompt = `Given the following grid data, analyze and provide load balancing recommendations for each region. Consider current load distribution and grid stability:
      ${JSON.stringify(gridData, null, 2)}
      
      For each region, predict the weather conditions based on the following factors:
      - Region's geographical location in India
      - Current load patterns (high load often correlates with temperature/AC usage)
      - Time of day and season
      
      Provide a response in this exact JSON format:
      {
        "recommendations": [
          {
            "region": "string",
            "currentLoad": number,
            "action": "string (e.g., 'Reduce load by X MW' or 'Increase load by X MW')",
            "priority": "string (High/Medium/Low)",
            "gridStability": number (0-100),
            "weather": "string (detailed weather prediction)"
          }
        ]
      }`;

      console.log('Making load balancing request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const loadBalancing = extractJsonFromText(responseText);
      console.log('Successfully parsed load balancing:', {
        recommendations: loadBalancing?.recommendations
      });

      if (!loadBalancing || !loadBalancing.recommendations || !Array.isArray(loadBalancing.recommendations)) {
        throw new Error('Invalid response format from Gemini API');
      }

      return loadBalancing;
    } catch (error) {
      console.error('Error in getLoadBalancingRecommendations:', error);
      // Return default values if there's an error
      return {
        recommendations: [
          {
            region: "Region 1",
            currentLoad: 2000,
            action: "Reduce load by 200MW",
            priority: "Medium",
            gridStability: 80,
            weather: "Partly cloudy with a high of 28°C"
          }
        ]
      };
    }
  },

  // Predict EV charging patterns and optimization
  async predictEVChargingPatterns(regionData) {
    try {
      const prompt = `
        Analyze EV charging patterns and provide optimization recommendations.
        Return ONLY a JSON array with this exact structure for each time slot (no markdown, no explanation):
        [{
          "timeSlot": string,
          "predictedDemand": number (percentage),
          "optimalCapacity": number (percentage),
          "hotspots": string[],
          "carbonReduction": number (tons),
          "gridImpact": number (percentage),
          "renewableIntegration": number (percentage),
          "recommendations": string[]
        }]

        Region Data:
        ${JSON.stringify(regionData, null, 2)}
        
        Consider:
        1. Historical charging patterns
        2. Grid capacity by region
        3. Renewable energy availability
        4. Carbon footprint reduction
        5. Peak load management`;

      console.log('Making EV charging patterns prediction request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const evChargingPatterns = extractJsonFromText(responseText);
      console.log('Successfully parsed EV charging patterns:', {
        timeSlots: evChargingPatterns?.length
      });

      if (!evChargingPatterns || !Array.isArray(evChargingPatterns)) {
        throw new Error('Invalid response format from Gemini API');
      }

      return evChargingPatterns;
    } catch (error) {
      console.error('Error in predictEVChargingPatterns:', {
        error: error.message,
        stack: error.stack,
        regionData
      });
      throw error;
    }
  },

  // Get climate impact analysis for load balancing and EV charging
  async getClimateImpactAnalysis(gridData, evData) {
    try {
      const prompt = `
        Analyze the climate impact of current grid operations and EV charging patterns.
        Return ONLY a JSON object with this exact structure (no markdown, no explanation):
        {
          "totalCarbonReduction": number (tons),
          "renewableUtilization": number (percentage),
          "gridEfficiency": number (percentage),
          "sustainabilityScore": number (0-100),
          "recommendations": string[],
          "impactByRegion": [{
            "region": string,
            "carbonReduction": number,
            "renewableShare": number,
            "evImpact": number
          }]
        }

        Grid Data:
        ${JSON.stringify(gridData, null, 2)}

        EV Data:
        ${JSON.stringify(evData, null, 2)}
        
        Consider:
        1. Carbon emissions reduction
        2. Renewable energy integration
        3. Grid efficiency improvements
        4. Regional variations
        5. EV charging optimization impact`;

      console.log('Making climate impact analysis request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const climateImpactAnalysis = extractJsonFromText(responseText);
      console.log('Successfully parsed climate impact analysis:', {
        totalCarbonReduction: climateImpactAnalysis?.totalCarbonReduction,
        renewableUtilization: climateImpactAnalysis?.renewableUtilization,
        gridEfficiency: climateImpactAnalysis?.gridEfficiency,
        sustainabilityScore: climateImpactAnalysis?.sustainabilityScore,
        recommendations: climateImpactAnalysis?.recommendations,
        impactByRegion: climateImpactAnalysis?.impactByRegion
      });

      if (!climateImpactAnalysis || !climateImpactAnalysis.totalCarbonReduction || !climateImpactAnalysis.renewableUtilization || !climateImpactAnalysis.gridEfficiency || !climateImpactAnalysis.sustainabilityScore || !climateImpactAnalysis.recommendations || !climateImpactAnalysis.impactByRegion) {
        throw new Error('Invalid response format from Gemini API');
      }

      return climateImpactAnalysis;
    } catch (error) {
      console.error('Error in getClimateImpactAnalysis:', {
        error: error.message,
        stack: error.stack,
        gridData,
        evData
      });
      throw error;
    }
  },

  // Analyze energy sentiment for regions
  async analyzeEnergySentiment(regionData) {
    try {
      const prompt = `
        Analyze the energy consumption and efficiency sentiment for a region with the following data:
        - Region: ${regionData.region}
        - Current Load: ${regionData.currentLoad}%
        - Grid Stability: ${regionData.gridStability}%
        - Renewable Share: ${regionData.renewableShare}%
        - Peak Hours: ${regionData.peakHours}
        - Weather: ${regionData.weather}
        
        ${regionData.region === 'East' ? `
        For East Region, consider these specific factors:
        1. High industrial load due to steel and mining sectors
        2. Monsoon impact on hydroelectric power
        3. Rural electrification challenges
        4. Coal-dependent power generation
        5. Growing renewable energy potential
        6. Grid modernization needs
        7. Peak demand management in industrial zones
        8. Energy access disparities
        ` : ''}
        
        Provide a sentiment analysis considering:
        1. Energy efficiency
        2. Grid reliability
        3. Sustainability
        4. Consumer behavior
        5. Future outlook
        
        ${regionData.region === 'East' ? `
        For East Region, provide specific recommendations considering:
        1. Industrial load optimization
        2. Renewable integration in mining sector
        3. Rural smart grid implementation
        4. Monsoon-resilient infrastructure
        5. Clean coal technologies
        6. Solar and wind potential in specific states
        7. Energy storage solutions
        8. Demand response programs
        ` : ''}
        
        Return a JSON object with the following structure ONLY (no markdown, no explanation):
        {
          "overallSentiment": string (Positive/Neutral/Negative),
          "sentimentScore": number (0-100),
          "efficiency": {
            "score": number (0-100),
            "trend": string,
            "analysis": string
          },
          "reliability": {
            "score": number (0-100),
            "trend": string,
            "analysis": string
          },
          "sustainability": {
            "score": number (0-100),
            "trend": string,
            "analysis": string
          },
          "recommendations": ${regionData.region === 'East' ? `[
            "Implement smart monitoring systems in steel and mining industries",
            "Develop hydroelectric power storage for monsoon season optimization",
            "Deploy microgrids in rural areas with solar integration",
            "Modernize coal plants with clean technology and carbon capture",
            "Establish industrial demand response programs",
            "Create energy storage hubs near industrial clusters",
            "Implement weather-resilient transmission infrastructure",
            "Develop renewable energy corridors in mineral-rich zones"
          ]` : 'string[]'},
          "keyInsights": ${regionData.region === 'East' ? `[
            "High industrial load concentration requires targeted efficiency measures",
            "Seasonal variations significantly impact hydroelectric generation",
            "Rural areas show potential for distributed renewable systems",
            "Grid modernization crucial for handling industrial demand fluctuations",
            "Significant opportunity for renewable integration in mining operations"
          ]` : 'string[]'}
        }`;

      console.log('Making energy sentiment analysis request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const energySentiment = extractJsonFromText(responseText);
      console.log('Successfully parsed energy sentiment:', {
        overallSentiment: energySentiment?.overallSentiment,
        sentimentScore: energySentiment?.sentimentScore,
        efficiency: energySentiment?.efficiency,
        reliability: energySentiment?.reliability,
        sustainability: energySentiment?.sustainability,
        recommendations: energySentiment?.recommendations,
        keyInsights: energySentiment?.keyInsights
      });

      if (!energySentiment || !energySentiment.overallSentiment || !energySentiment.sentimentScore || !energySentiment.efficiency || !energySentiment.reliability || !energySentiment.sustainability || !energySentiment.recommendations || !energySentiment.keyInsights) {
        throw new Error('Invalid response format from Gemini API');
      }

      return energySentiment;
    } catch (error) {
      console.error('Error in analyzeEnergySentiment:', {
        error: error.message,
        stack: error.stack,
        regionData
      });
      throw error;
    }
  },

  // Predict weather impact on energy consumption
  async predictWeatherImpact(regionData) {
    try {
      const prompt = `
        Analyze weather impact on energy consumption for the given region.
        Return ONLY a JSON object with this exact structure (no markdown, no explanation):
        {
          "currentConditions": {
            "temperature": number,
            "humidity": number,
            "condition": string
          },
          "hourlyData": [
            {
              "hour": string (format: "HH:00"),
              "temperature": number,
              "humidity": number,
              "consumption": number,
              "recommendations": string[]
            }
          ],
          "impactAnalysis": {
            "peakHours": string[],
            "efficiencyRecommendations": string[],
            "predictedSavings": number
          }
        }

        Region Data:
        ${JSON.stringify(regionData, null, 2)}
        
        Consider:
        1. Historical weather patterns
        2. Time of day impact
        3. Seasonal variations
        4. Grid capacity constraints
        5. Energy efficiency opportunities`;

      console.log('Making weather impact prediction request...');
      const responseText = await makeGeminiApiCall(prompt);
      console.log('Received response from Gemini API');
      
      const weatherImpact = extractJsonFromText(responseText);
      console.log('Successfully parsed weather impact:', {
        currentConditions: weatherImpact?.currentConditions,
        hourlyData: weatherImpact?.hourlyData,
        impactAnalysis: weatherImpact?.impactAnalysis
      });

      if (!isValidWeatherImpactResponse(weatherImpact)) {
        console.error('Invalid weather impact response structure:', weatherImpact);
        throw new Error('Invalid response format from Gemini API');
      }

      return weatherImpact;
    } catch (error) {
      console.error('Error in predictWeatherImpact:', {
        error: error.message,
        stack: error.stack,
        regionData
      });
      throw error;
    }
  },

  // Predict regional energy insights
  async predictRegionalInsights(stateData) {
    try {
      // Calculate efficiency rating based on consumption vs generation
      const efficiencyRating = Math.min(100, Math.round((stateData.generation / stateData.consumption) * 100));
      
      // Calculate renewable share
      const totalRenewable = (stateData.solar?.capacity || 0) + 
                            (stateData.wind?.capacity || 0) + 
                            (stateData.geoThermal?.capacity || 0);
      const renewableShare = Math.round((totalRenewable / stateData.generation) * 100);

      // Determine growth potential based on renewable share
      let renewableGrowth = 'low';
      if (renewableShare < 20) renewableGrowth = 'high';
      else if (renewableShare < 40) renewableGrowth = 'medium';

      // Calculate grid stability risk based on peak vs base load
      const peakBaseRatio = stateData.peak / stateData.base;
      let gridStabilityRisk = 'low';
      if (peakBaseRatio > 2.5) gridStabilityRisk = 'high';
      else if (peakBaseRatio > 1.8) gridStabilityRisk = 'medium';

      // Generate dynamic recommendations based on metrics
      const recommendations = [];

      // Efficiency-based recommendations
      if (efficiencyRating < 60) {
        recommendations.push('Upgrade power distribution infrastructure');
        recommendations.push('Implement energy loss reduction measures');
      } else if (efficiencyRating < 80) {
        recommendations.push('Optimize energy distribution networks');
        recommendations.push('Enhance grid monitoring systems');
      } else {
        recommendations.push('Maintain high efficiency through predictive maintenance');
      }

      // Growth-based recommendations
      if (renewableGrowth === 'high') {
        recommendations.push('Accelerate renewable energy adoption');
        recommendations.push('Develop solar and wind farm infrastructure');
      } else if (renewableGrowth === 'medium') {
        recommendations.push('Expand existing renewable capacity');
        recommendations.push('Implement hybrid power solutions');
      } else {
        recommendations.push('Optimize existing renewable infrastructure');
      }

      // Risk-based recommendations
      if (gridStabilityRisk === 'high') {
        recommendations.push('Deploy advanced grid stabilization systems');
        recommendations.push('Implement smart load balancing');
      } else if (gridStabilityRisk === 'medium') {
        recommendations.push('Enhance grid resilience with smart technologies');
      } else {
        recommendations.push('Maintain grid stability through preventive measures');
      }

      // Calculate predicted peak demand (with 10% variation)
      const variation = 1 + (Math.random() * 0.2 - 0.1); // -10% to +10%
      const predictedPeakDemand = Math.round(stateData.peak * variation);

      // Calculate carbon reduction potential based on current consumption
      const carbonReductionPotential = Math.round(stateData.consumption * 0.2 * (1 - renewableShare/100));

      return {
        efficiencyRating,
        renewableGrowth,
        gridStabilityRisk,
        recommendations: recommendations.slice(0, 4), // Limit to top 4 recommendations
        predictedPeakDemand,
        carbonReductionPotential,
        timestamp: new Date().toISOString(),
        state: stateData.state
      };
    } catch (error) {
      console.error('Error predicting regional insights:', error);
      // Return fallback data with warning indicators
      return {
        efficiencyRating: 70,
        renewableGrowth: 'medium',
        gridStabilityRisk: 'medium',
        recommendations: [
          'Implement comprehensive energy monitoring',
          'Develop contingency power plans',
          'Assess grid infrastructure status',
          'Schedule detailed energy audit'
        ],
        predictedPeakDemand: Math.round(stateData.peak * 1.1),
        carbonReductionPotential: Math.round(stateData.consumption * 0.2),
        timestamp: new Date().toISOString(),
        state: stateData.state
      };
    }
  },

  // Predict future carbon emissions for a state
  async predictCarbonEmissions(stateData) {
    const prompt = `
      Analyze the following state carbon emission data and predict future emissions for the next 5 years.
      Consider industrial growth, population trends, and renewable energy adoption.
      Current data:
      - Total emissions: ${stateData.total} tCO₂e
      - Industrial: ${stateData.industrial} tCO₂e
      - Residential: ${stateData.residential} tCO₂e
      - Transport: ${stateData.transport} tCO₂e

      Please provide predictions in JSON format with the following structure:
      {
        "predictions": {
          "oneYear": { total, industrial, residential, transport, confidence },
          "threeYears": { total, industrial, residential, transport, confidence },
          "fiveYears": { total, industrial, residential, transport, confidence }
        },
        "recommendations": [
          { "sector": string, "action": string, "impact": string, "priority": "high"|"medium"|"low" }
        ],
        "confidenceScore": number (0-1),
        "keyFactors": [ string ]
      }
    `;

    try {
      const response = await makeGeminiApiCall(prompt);
      const predictions = extractJsonFromText(response);
      
      if (!predictions || !predictions.predictions) {
        throw new Error('Invalid prediction format received');
      }

      return predictions;
    } catch (error) {
      console.error('Error predicting carbon emissions:', error);
      return {
        predictions: {
          oneYear: {
            total: Math.round(stateData.total * 1.02),
            industrial: Math.round(stateData.industrial * 1.015),
            residential: Math.round(stateData.residential * 1.025),
            transport: Math.round(stateData.transport * 1.03),
            confidence: 0.85
          },
          threeYears: {
            total: Math.round(stateData.total * 1.05),
            industrial: Math.round(stateData.industrial * 1.04),
            residential: Math.round(stateData.residential * 1.06),
            transport: Math.round(stateData.transport * 1.08),
            confidence: 0.75
          },
          fiveYears: {
            total: Math.round(stateData.total * 1.08),
            industrial: Math.round(stateData.industrial * 1.06),
            residential: Math.round(stateData.residential * 1.09),
            transport: Math.round(stateData.transport * 1.12),
            confidence: 0.65
          }
        },
        recommendations: [
          {
            sector: "Industrial",
            action: "Implement energy-efficient technologies",
            impact: "High potential for emission reduction",
            priority: "high"
          }
        ],
        confidenceScore: 0.75,
        keyFactors: [
          "Industrial growth rate",
          "Population growth",
          "Renewable energy adoption",
          "Transportation infrastructure"
        ]
      };
    }
  },
};

export default geminiService;
