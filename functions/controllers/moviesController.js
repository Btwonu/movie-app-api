const { Router } = require('express');

// Services
const movieService = require('../services/movieService');

const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// Movie routes
// router.get('/', (req, res) => {
//   let { category, page, limit } = req.query;

//   if (!category) {
//     movieService.getCategories().then((results) => {
//       res.json(results);
//     });
//   }

//   console.log({ category });
//   movieService.getMovies(category, page, limit).then((movies) => {
//     res.json(movies);
//   });
// });

router.get('/', (req, res) => {
  let { category, page, limit } = req.query;

  if (!category) {
    movieService
      .getCategories()
      .then((results) => {
        res.json(results);
      })
      .catch((err) => res.json(err));
  } else {
    movieService
      .getMovies(category, page, limit)
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => res.json(err));
  }
});

router.get('/popular', async (req, res) => {
  movieService.getPopular().then((movies) => {
    res.json(movies);
  });
});

router.get('/top_rated', (req, res) => {
  movieService.getTopRated().then((movies) => {
    res.json(movies);
  });
});

router.get('/upcoming', (req, res) => {
  movieService.getUpcoming().then((movies) => {
    res.json(movies);
  });
});

router.get('/:movieId', (req, res) => {
  let { movieId } = req.params;

  movieService.getOne(movieId).then((data) => {
    res.json(data);
  });
});

module.exports = router;
