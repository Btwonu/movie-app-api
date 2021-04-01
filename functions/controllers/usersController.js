const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const router = Router();

const authMiddleware = require('../middleware/authMiddleware');
const authService = require('../services/authService');

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

router.get('/profile', authMiddleware, (req, res) => {
  authService
    .getProfile(req.user.uid)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
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
