
const axios = require('axios');
const weather_key = process.env.WEATHERBIT_API_KEY;

class Forecast {
  constructor(date, description, high, low) {
    this.date = date;
    this.description = description;
    this.high = high;
    this.low = low;
  }
}
// lat:lon -> weather data for the week
const cache = {};

async function fetchWeatherData(raw_lat_lon) {
  try {
    const lat = Number(parseFloat(raw_lat_lon.split('_')[0]).toFixed(4));
    const lon = Number(parseFloat(raw_lat_lon.split('_')[1]).toFixed(4));
    if (cache[`${lat}:${lon}`] && Date.now() < cache[`${lat}:${lon}`].timestamp + 10000) {
      return cache[`${lat}:${lon}`].weatherDex;
    } else {
      let weatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weather_key}&days=6&units=I`);
      const weatherDex = weatherData.data.data.map((values) => {
        return new Forecast(values.datetime, values.weather.description, values.max_temp, values.min_temp);
      });

      cache[`${lat}:${lon}`] = {
        weatherDex,
        timestamp: Date.now()
      };

      return weatherDex;
    }

  } catch (error) {
    console.log('Cannot get weather data for provided location');
    return null;
  }
}

module.exports = {
  fetchWeatherData
};
