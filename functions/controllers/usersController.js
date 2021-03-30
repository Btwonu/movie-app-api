const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const router = Router();

const authMiddleware = require('../middleware/authMiddleware');

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
  let user = {};

  firestore
    .doc(`/users/${req.user.username.toLowerCase()}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.json({ user: 'User does not exist' });
      }

      user = doc.data();
      let collectionPromises = [];

      // doc.data().createdCollections.forEach((collectionDocRef) => {
      //   collectionDocRef.get().then((queryDocSnapshot) => {
      //     let collection = queryDocSnapshot.data();
      //     createdCollections.push(collection);
      //   });
      // });

      doc.data().createdCollections.forEach((collectionDocRef) => {
        collectionPromises.push(collectionDocRef.get());
      });

      return Promise.all(collectionPromises).then((resultsArr) => {
        return resultsArr.map((queryDocSnapshot) => queryDocSnapshot.data());
      });
    })
    .then((collectionsArr) => {
      user.createdCollections = collectionsArr;
      res.json(user);
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
