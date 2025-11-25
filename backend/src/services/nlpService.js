const axios = require('axios');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:5001';

// Call NLP service to classify task
exports.classifyTask = async (text) => {
  try {
    const response = await axios.post(`${NLP_SERVICE_URL}/api/nlp/classify`, {
      text
    });
    
    return response.data;
  } catch (error) {
    console.error('NLP Service Error:', error.message);
    // Return defaults if NLP service fails
    return {
      category: 'other',
      priority: 'medium',
      suggestions: []
    };
  }
};

// Call NLP service to break down task
exports.breakdownTask = async (text) => {
  try {
    const response = await axios.post(`${NLP_SERVICE_URL}/api/nlp/breakdown`, {
      text
    });
    
    return response.data;
  } catch (error) {
    console.error('NLP Service Error:', error.message);
    return {
      subtasks: [],
      suggestions: []
    };
  }
};