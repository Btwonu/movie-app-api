// Dependancies
const functions = require('firebase-functions');
const axios = require('axios').default;

// Constants
const API_KEY = functions.config().tmdb.key;
const BASE_URL = functions.config().tmdb.base_url;

const getMovies = async (category, page, limit) => {
  let urlString = BASE_URL + '/movie/' + category;

  const params = {
    api_key: API_KEY,
    language: 'en-US',
  };

  if (page) {
    params.page = page;
  }

  let movies = null;

  try {
    movies = await axios.get(urlString, { params });
  } catch (error) {
    console.log('In axios catch');
    console.log({ error });
  }

  let moviesArr = movies.data.results.map(extractMovieInfo);

  if (limit) {
    return moviesArr.slice(0, limit);
  }

  return moviesArr;
};

const getCategories = async () => {
  let promises = [
    getMovies('popular', 1, 4),
    getMovies('top_rated', 1, 4),
    getMovies('upcoming', 1, 4),
  ];

  const mapper = {
    0: 'popular',
    1: 'top_rated',
    2: 'upcoming',
  };

  return Promise.all(promises).then((results) => {
    return results.map((movies, index) => {
      let category = mapper[index];

      return {
        name: category,
        movies,
        url: `/movies/categories/${category}`,
      };
    });
  });
};

const getPopular = async () => {
  let urlString = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);
  let moviesArr = movies.data.results.map(extractMovieInfo);

  return moviesArr;
};

const getTopRated = async () => {
  let urlString = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);

  let moviesArr = movies.data.results.map(extractMovieInfo);

  return moviesArr;
};

const getUpcoming = async () => {
  let urlString = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`;

  let movies = await axios.get(urlString);
  let moviesArr = movies.data.results.map(extractMovieInfo);

  return moviesArr;
};

const getOne = async (id) => {
  console.log('from getOne', id);
  let urlString = `${BASE_URL}/movie/${id}`;

  const params = {
    api_key: API_KEY,
    languaage: 'en-US',
  };

  let movie = await axios.get(urlString, { params });
  return extractMovieInfo(movie.data);
};

function extractMovieInfo(movie) {
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
}

module.exports = {
  getMovies,
  getPopular,
  getTopRated,
  getUpcoming,
  getOne,
  getCategories,
};

// poster_path
// overview
// release_date
// genre_ids
// id
// title
// popularity

// https://api.themoviedb.org/3/discover/movie?api_key=8ca4deb42599aca624b1c5fa68bcdbfd&language=en-US&sort_by=popularity.desc
