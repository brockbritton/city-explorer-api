
const axios = require('axios');
const movies_key = process.env.MOVIE_API_KEY;

class Movie {
  constructor(title, date, description) {
    this.title = title;
    this.date = date;
    this.description = description;
  }
}

//city -> movies
const cache = {};

async function fetchMoviesData(city) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movies_key}`
      }
    };

    if (cache[city] && Date.now() < cache[city].timestamp + 10000) {
      return cache[city].weatherDex;
    } else {
      let movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${city}&include_adult=false&language=en-US&page=1`, options);
      const movieDex = movieData.data.results.map((values) => {
        return new Movie(values.title, values.release_date, values.overview);
      });

      cache[city] = {
        movieDex,
        timestamp: Date.now()
      };

      return movieDex;
    }
  } catch (error) {
    console.log('Cannot get movie data for the location provided');
    return null;
  }
}

module.exports = {
  fetchMoviesData
};
