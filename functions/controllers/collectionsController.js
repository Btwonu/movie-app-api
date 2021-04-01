const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const collectionService = require('../services/collectionService');

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
});

router.get('/:collectionId/movies', (req, res) => {
  let { collectionId } = req.params;

  console.log({ collectionId });

  collectionService
    .getCollectionMovies(collectionId)
    .then((collection) => res.json(collection))
    .catch((err) => res.json({ err }));
});

router.post('/:collectionId/movies', (req, res) => {
  let { collectionId } = req.params;

  console.log({ collectionId });

  // Update current collection movie array
});

router.post('/', (req, res) => {
  let userId = 'AvJcedqhkSFRAjnho754sZRmZlTg';
  let newCollection = {
    title: req.body.title,
    description: req.body.description,
    movies: [],
    creator: firestore.doc(`users/${userId}`),
  };

  // Add a collection creator
  firestore
    .collection(`/collections`)
    .add(newCollection)
    .then((doc) => res.json(doc.id));
});

module.exports = router;
