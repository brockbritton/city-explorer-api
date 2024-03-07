
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const movies_key = process.env.MOVIE_API_KEY;

class Movie {
  constructor(title, date, description) {
    this.title = title;
    this.date = date;
    this.description = description;
  }
}

async function fetchMoviesData(city) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movies_key}`
      }
    };

    let movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${city}&include_adult=false&language=en-US&page=1`, options);
    return movieData.data.results.map((values) => {
      return new Movie(values.title, values.release_date, values.overview);
    });
  } catch (error) {
    console.log('Cannot get movie data');
    return [];
  }
}

module.exports = {
  fetchMoviesData
};
