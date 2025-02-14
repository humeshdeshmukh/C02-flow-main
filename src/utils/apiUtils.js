/**
 * Utility functions for API response handling
 */

/**
 * Extracts and parses JSON from a text response
 * @param {string} responseText - The response text that may contain JSON
 * @returns {Object} The parsed JSON object
 * @throws {Error} If no valid JSON is found
 */
export const extractJsonFromResponse = (responseText) => {
  try {
    // First try direct JSON parse
    return JSON.parse(responseText);
  } catch (e) {
    try {
      // Remove markdown code block indicators if present
      const jsonString = responseText.replace(/```(json|JSON)?/g, '').trim();
      return JSON.parse(jsonString);
    } catch (e2) {
      try {
        // If still fails, try to find JSON object within the text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e3) {
        console.error('Failed to parse JSON response:', {
          originalText: responseText,
          error: e3.message
        });
      }
      throw new Error('No valid JSON found in response');
    }
  }
};

/**
 * Validates the structure of a weather impact prediction response
 * @param {Object} data - The parsed response data
 * @returns {boolean} True if the data structure is valid
 */
export const isValidWeatherImpactResponse = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Check currentConditions
  if (!data.currentConditions || 
      typeof data.currentConditions.temperature !== 'number' ||
      typeof data.currentConditions.humidity !== 'number' ||
      typeof data.currentConditions.condition !== 'string') {
    return false;
  }
  
  // Check hourlyData
  if (!Array.isArray(data.hourlyData) || data.hourlyData.length === 0) {
    return false;
  }
  
  // Check each hourly data entry
  return data.hourlyData.every(hour => (
    typeof hour.hour === 'string' &&
    typeof hour.temperature === 'number' &&
    typeof hour.humidity === 'number' &&
    typeof hour.consumption === 'number' &&
    Array.isArray(hour.recommendations)
  ));
};

export default {
  extractJsonFromResponse,
  isValidWeatherImpactResponse
};
