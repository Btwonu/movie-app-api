const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const collectionService = require('../services/collectionService');
const movieService = require('../services/movieService');

const router = Router();

router.get('/', (req, res) => {
  collectionService
    .getAllCollections()
    .then((data) => {
      console.log('data', data);

      res.json(data);
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

router.get('/:collectionId', (req, res) => {
  let { collectionId } = req.params;

  console.log({ collectionId });

  // Get a single collection
  collectionService
    .getOneCollection(collectionId)
    .then((collection) => {
      let moviePromiseArray = collection.movies.map((movieId) =>
        movieService.getOne(movieId)
      );

      Promise.all(moviePromiseArray).then((movies) => {
        res.json({ collection, movies });
      });
    })
    .catch((err) => res.json({ err }));
});

router.get('/:collectionId/movies', (req, res) => {
  let { collectionId } = req.params;

  console.log({ collectionId });

  collectionService
    .getCollectionMovies(collectionId)
    .then((collection) => res.json(collection))
    .catch((err) => res.json({ err }));
});

router.post('/', (req, res) => {
  let { title, description, userId } = req.body;

  // validate data
  collectionService
    .createCollection(title, description, userId)
    .then((collectionId) => {
      res.json({ collectionId });
    });
});

router.post('/:collectionId/movies/:movieId', (req, res) => {
  let { collectionId, movieId } = req.params;

  console.log({ collectionId, movieId });

  // Update current collection movie array
  collectionService
    .addMovieToCollection(collectionId, movieId)
    .then((data) => res.status(201).json({ written: true }))
    .catch((err) => res.json({ err }));
});

router.delete('/:collectionId', (req, res) => {
  let { collectionId } = req.params;

  collectionService
    .deleteCollection(collectionId)
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
});

module.exports = router;
