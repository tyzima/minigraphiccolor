// vectorize.js
const request = require('request');

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

  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://vectorizer.ai/api/v1/vectorize',
      formData: {
        'image.base64': base64Image,
        'processing.max_colors': colors
      },
      auth: { user: API_ID, pass: API_SECRET },
      followAllRedirects: true,
      encoding: null
    }, function(error, response, body) {
      if (error) {
        return reject({
          statusCode: 500,
          body: 'Internal Server Error'
        });
      }

      if (response && response.statusCode !== 200) {
        return reject({
          statusCode: 500,
          body: 'Internal Server Error'
        });
      }

      resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'image/svg+xml' },
        body: body.toString('utf8')
      });
    });
  });
};
