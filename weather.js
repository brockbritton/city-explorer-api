
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

async function fetchWeatherData(raw_lat_lon) {
  try {
    const lat = Number(parseFloat(raw_lat_lon.split('_')[0]).toFixed(4));
    const lon = Number(parseFloat(raw_lat_lon.split('_')[1]).toFixed(4));
    let weatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weather_key}&days=6&units=I`);
    return weatherData.data.data.map((values) => {
      return new Forecast(values.datetime, values.weather.description, values.max_temp, values.min_temp);
    });
  } catch (error) {
    console.log('Cannot get weather data for provided location');
    return null;
  }
}

module.exports = {
  fetchWeatherData
};
