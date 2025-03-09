// Nutriversee/backend/server.js
require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const FormData = require('form-data');

// Use a dynamic import wrapper for node-fetch (compatible with node-fetch v3)
const fetchWrapper = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const LOGMEAL_API_TOKEN = process.env.LOGMEAL_API_TOKEN || 'YOUR_LOGMEAL_API_TOKEN';
const BASE_URL = process.env.BASE_URL || 'https://api.logmeal.com';

// Increase payload limit if necessary
app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Explicit route to serve the landing page (Homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/main/Homepage.html'));
});

// POST endpoint to process the captured image and retrieve recognition and nutritional info
app.post('/api/scan', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    // Extract Base64 data from data URL
    const parts = image.split(',');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid image data.' });
    }
    const base64Data = parts[1];
    const imgBuffer = Buffer.from(base64Data, 'base64');
    console.log('Image buffer length:', imgBuffer.length);

    // Step 1: Call the Recognition Endpoint using multipart/form-data
    const recognitionEndpoint = `${BASE_URL}/v2/image/recognition/complete/v1.0?skip_types=[]&language=eng`;
    console.log('Calling Recognition API at:', recognitionEndpoint);

    const form = new FormData();
    form.append('image', imgBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

    const recognitionResponse = await fetchWrapper(recognitionEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOGMEAL_API_TOKEN}`,
        ...form.getHeaders()
      },
      body: form
    });

    console.log('Recognition response status:', recognitionResponse.status);
    const recognitionText = await recognitionResponse.text();
    console.log('Raw Recognition API response text:', recognitionText);

    let recognitionData;
    try {
      recognitionData = JSON.parse(recognitionText);
    } catch (jsonErr) {
      console.error('Error parsing recognition JSON response:', jsonErr);
      return res.status(500).json({ error: 'Error parsing recognition response from LogMeal API.' });
    }

    if (!recognitionData.imageId) {
      return res.status(500).json({ error: 'ImageId not found in recognition response.' });
    }
    const imageId = recognitionData.imageId;
    console.log('Received imageId:', imageId);

    // Step 2: Call the Nutritional Information Endpoint with the imageId
    const nutritionalEndpoint = `${BASE_URL}/v2/nutrition/recipe/nutritionalInfo/v1.0?skip_types=[]&language=eng`;
    console.log('Calling Nutritional Info API at:', nutritionalEndpoint);

    const nutritionalResponse = await fetchWrapper(nutritionalEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOGMEAL_API_TOKEN}`
      },
      body: JSON.stringify({ imageId: imageId })
    });

    console.log('Nutritional Info response status:', nutritionalResponse.status);
    const nutritionalText = await nutritionalResponse.text();
    console.log('Raw Nutritional Info API response text:', nutritionalText);

    let nutritionalData;
    try {
      nutritionalData = JSON.parse(nutritionalText);
    } catch (jsonErr) {
      console.error('Error parsing nutritional JSON response:', jsonErr);
      return res.status(500).json({ error: 'Error parsing nutritional info response from LogMeal API.' });
    }

    // Return combined recognition and nutritional information
    res.json({
      recognition: recognitionData,
      nutrition: nutritionalData
    });
  } catch (error) {
    console.error('Error in /api/scan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
