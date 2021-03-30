const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const collectionService = require('../services/collectionService');

const router = Router();

// Collections routes
router.get('/', (req, res) => {
  collectionService
    .getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

router.post('/', (req, res) => {
  let newCollection = {
    title: req.body.title,
    description: req.body.description,
    movies: req.body.movies,
  };

  // Add a collection creator
  firestore
    .collection(`/collections`)
    .add(newCollection)
    .then((doc) => res.json(doc.id));
});

module.exports = router;
