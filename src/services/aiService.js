import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const analyzeDocument = async (fileContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze the following document for carbon emissions data. Extract and categorize information into:
    1. Scope 1 (direct emissions): fuel consumption, company vehicles
    2. Scope 2 (indirect emissions): electricity usage, heating
    3. Scope 3 (value chain emissions): business travel, purchased goods
    
    Document content:
    ${fileContent}
    
    Return the data in JSON format with confidence scores.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
};

export const getEmissionInsights = async (emissionData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze the following carbon emission data and provide insights:
    ${JSON.stringify(emissionData)}
    
    Provide:
    1. Key trends and patterns
    2. Comparison with industry standards
    3. Recommendations for reduction
    4. Potential cost savings
    
    Return the analysis in JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI Insights Error:', error);
    throw error;
  }
};

export const generateReductionStrategies = async (emissionData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on the following emission data, suggest detailed reduction strategies:
    ${JSON.stringify(emissionData)}
    
    For each scope:
    1. Short-term actions (0-6 months)
    2. Medium-term initiatives (6-18 months)
    3. Long-term projects (18+ months)
    4. Estimated cost and ROI
    5. Implementation complexity
    
    Return the strategies in JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI Strategy Error:', error);
    throw error;
  }
};

export const predictFutureEmissions = async (historicalData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Using this historical emission data, predict future emissions and trends:
    ${JSON.stringify(historicalData)}
    
    Provide:
    1. 6-month forecast
    2. 12-month forecast
    3. Confidence intervals
    4. Key factors influencing predictions
    
    Return predictions in JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI Prediction Error:', error);
    throw error;
  }
};
