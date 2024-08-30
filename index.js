const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Weather App!');
});

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHERSTACK_API_KEY;
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.success === false) {
      return res.status(400).json({ error: 'Unable to find location' });
    }

    const weatherInfo = {
      location: data.location.name,
      temperature: data.current.temperature,
      description: data.current.weather_descriptions[0],
      wind_speed: data.current.wind_speed,
      humidity: data.current.humidity,
    };

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
