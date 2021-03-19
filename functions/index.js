const functions = require('firebase-functions');
const { admin, firestore } = require('./util/admin');

exports.helloWorld = functions.https.onRequest((req, res) => {
  firestore
    .collection('users')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        res.send({
          id: doc.id,
          data: doc.data(),
        });
      });
    });
});
