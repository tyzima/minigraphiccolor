const axios = require('axios');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST' || !event.body) {
    return {
      statusCode: 400,
      body: 'You must POST an image'
    };
  }

  const { image: base64Image, colors } = JSON.parse(event.body);
  const API_ID = process.env.VECTORIZE_USER;
  const API_SECRET = process.env.VECTORIZE_PASS;

  const form = new FormData();
  form.append('image.base64', base64Image);
  form.append('processing.max_colors', colors);

  try {
    const response = await axios.post('https://vectorizer.ai/api/v1/vectorize', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Basic ${Buffer.from(`${API_ID}:${API_SECRET}`).toString('base64')}`
      },
      responseType: 'text'
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
      body: response.data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
