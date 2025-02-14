// API Configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debug environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    GEMINI_API_KEY_LENGTH: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
    HAS_GEMINI_KEY: !!GEMINI_API_KEY
  });
}

// Validate API key format
const isValidGeminiKey = (key) => {
  return typeof key === 'string' && 
         key.startsWith('AIza') && 
         key.length > 30;
};

export const API_CONFIG = {
  GEMINI_API_KEY: GEMINI_API_KEY,
};

// Validate API key presence and format
if (!API_CONFIG.GEMINI_API_KEY) {
  console.error('Error: REACT_APP_GEMINI_API_KEY is not set in environment variables');
} else if (!isValidGeminiKey(API_CONFIG.GEMINI_API_KEY)) {
  console.error('Error: REACT_APP_GEMINI_API_KEY is invalid. It should start with "AIza" and be at least 30 characters long');
}
