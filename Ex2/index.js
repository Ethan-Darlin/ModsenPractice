const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=8a58de7c43159a0f641c7d83078abd6f');
        console.log(response.status); // Статус ответа
        res.send(`Статус ответа: ${response.status}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении данных от OpenWeatherMap API');
    }
});
app.get('/bad-request', async (req, res) => {
  try {
      //без 'appid'
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=London');
      console.log(response.status); // Это не будет работать, так как 'appid' обязателен
      res.send(`Статус ответа: ${response.status}`);
  } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
          res.send(`Получен ожидаемый 400-й статус: ${error.message}`);
      } else {
          res.status(500).send('Ошибка при получении данных от OpenWeatherMap API.');
      }
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
