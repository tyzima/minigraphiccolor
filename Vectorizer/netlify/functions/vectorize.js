const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;
const USER = process.env.VECTORIZE_USER;
const PASS = process.env.VECTORIZE_PASS;


exports.handler = async function(event, context) {
  // Read the API key from environment variable
  const API_KEY = process.env.VECTORIZE_API;

  // Parse the incoming request data
  const body = JSON.parse(event.body);

  try {
    // Initialize form data
    const form = new FormData();
    form.append('image', body.image, { filename: 'logo.png' });
    form.append('processing.max_colors', body.max_colors);
    form.append('mode', 'production'); // You can set this dynamically based on your needs

    // Make the API request to vectorize the image
    const response = await axios.post('https://api.vectorizer.ai/api/v1/vectorize', form, {
        headers: {
          ...form.getHeaders()
        },
        auth: {
          username: USER,
          password: PASS
        }
      });

    // Send back the vectorized SVG
    return {
      statusCode: 200,
      body: JSON.stringify({
        svg: response.data
      })
    };

  } catch (error) {
    console.error('Error vectorizing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to vectorize image'
      })
    };
  }
};
