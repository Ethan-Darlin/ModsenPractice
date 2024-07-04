const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const API_KEY = '8a58de7c43159a0f641c7d83078abd6f';
const BASE_URL = 'http://api.openweathermap.org/data/2.5';

app.get('/statuses', async (req, res) => {
  try {
    const endpoints = [
      `${BASE_URL}/weather?q=London&appid=${API_KEY}`,
      `${BASE_URL}/forecast?q=London&appid=${API_KEY}`,
      `${BASE_URL}/onecall?lat=51.5074&lon=-0.1278&appid=${API_KEY}`
    ];

    const responses = await Promise.all(
      endpoints.map(endpoint => axios.get(endpoint))
    );

    const statuses = responses.map(response => ({
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    }));

    res.json(statuses);
  } catch (error) {
    console.error('Error making API request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Something went wrong', details: error.response ? error.response.data : error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});