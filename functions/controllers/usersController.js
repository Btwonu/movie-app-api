const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const router = Router();

// Users routes
router.get('/', (req, res) => {
  firestore
    .collection('users')
    .get()
    .then((querySnapshot) => {
      let docs = querySnapshot.docs;
      let arrOfDocs = [];

      for (let doc of docs) {
        arrOfDocs.push(doc.data());
      }

      res.json(arrOfDocs);
    });
});

router.get('/:username', (req, res) => {
  firestore
    .doc(`/users/${req.params.username}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.json({ user: 'User does not exist' });
      }

      res.json(doc.data());
    });
});

router.get('/:username/collections', (req, res) => {
  firestore
    .doc(`/users/${req.params.username}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.json({ user: 'User does not exist' });
      }

      res.json(doc.data().createdCollections);
    });
});

router.get('/:userId/friends', (req, res) => {
  res.send(req.params.userId);
});

module.exports = router;
