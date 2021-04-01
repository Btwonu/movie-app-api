const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const collectionService = require('../services/collectionService');

const router = Router();

// Collections routes
router.get('/', (req, res) => {
  collectionService
    .getAll()
    .then((data) => {
      console.log('data', data);
      res.json(data);
    })
    .catch((err) => {
      res.json({ error: err });
    });
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
