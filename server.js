'use strict';

const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // cross origin resource sharing tool

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const weather_key = process.env.WEATHERBIT_API_KEY;
app.use(cors());

class Forecast {
  constructor(date, description, high, low) {
    this.date = date;
    this.description = description;
    this.high = high;
    this.low = low;
  }
}

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/weather/:lat_lon', async (req, res) => {
  const lat = Number(parseFloat(req.params.lat_lon.split('_')[0]).toFixed(4));
  const lon = Number(parseFloat(req.params.lat_lon.split('_')[1]).toFixed(4));
  let weatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weather_key}&days=6&units=I`);
  let weatherDex = weatherData.data.data.map((values) => {
    return new Forecast(values.datetime, values.weather.description, values.max_temp, values.min_temp);
  });
  res.send(weatherDex);
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
