const { Router } = require('express');
const { admin, firestore } = require('../config/admin');

const router = Router();

// Collections routes
router.get('/', (req, res) => {
  firestore
    .collection('/collections')
    .get()
    .then((querySnapshot) => {
      let docs = querySnapshot.docs;
      let arrOfDocs = [];

      for (let doc of docs) {
        let collection = doc.data();

        if (doc.data().creator) {
          // this is the user reference
          doc
            .data()
            .creator.get()
            .then((creator) => {
              collection.creatorProp = creator.data();
              arrOfDocs.push(collection);
            });
        } else {
          arrOfDocs.push(collection);
        }
      }

      // I think this returns the results before creator has chance to be pushed
      return Promise.all(arrOfDocs);
    })
    .then((results) => res.json(results));
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
