// Dependancies
const functions = require('firebase-functions');
const axios = require('axios').default;

// Constants
const API_KEY = functions.config().tmdb.key;
const BASE_URL = functions.config().tmdb.base_url;

const getMovies = async () => {
  let urlString = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`;

  let movies = await axios.get(urlString);
  let moviesArr = extractMovieInfo(movies);

  return moviesArr;
};

const getPopular = async () => {
  let urlString = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);
  let moviesArr = extractMovieInfo(movies);

  return moviesArr;
};

const getTopRated = async () => {
  let urlString = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);
  let moviesArr = extractMovieInfo(movies);

  return moviesArr;
};

const getUpcoming = async () => {
  let urlString = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);
  let moviesArr = extractMovieInfo(movies);

  return moviesArr;
};

function extractMovieInfo(movies) {
  return movies.data.results.map((movie) => {
    let imageUrl = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
    let summary = movie.overview;
    let date = movie.release_date;
    let genreIds = movie.genre_ids;
    let tmdbId = movie.id;
    let title = movie.title;
    let popularity = movie.popularity;
    let voteAverage = movie.vote_average;

    return {
      imageUrl,
      summary,
      date,
      genreIds,
      tmdbId,
      title,
      popularity,
      voteAverage,
    };
  });
}

module.exports = {
  getMovies,
  getPopular,
  getTopRated,
  getUpcoming,
};

// poster_path
// overview
// release_date
// genre_ids
// id
// title
// popularity

// https://api.themoviedb.org/3/discover/movie?api_key=8ca4deb42599aca624b1c5fa68bcdbfd&language=en-US&sort_by=popularity.desc
