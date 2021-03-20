// Firebase
const functions = require('firebase-functions');
const { admin, firestore } = require('./config/admin');

// Server
const express = require('express');
const app = express();

// Services
const movieService = require('./services/movieService');

// Init
require('./config/express')(app);

app.get('/', (req, res) => {
  res.send({
    hello: 'hello',
  });
  // firestore
  //   .collection('users')
  //   .get()
  //   .then((snapshot) => {
  //     snapshot.forEach((doc) => {
  //       res.send({
  //         id: doc.id,
  //         data: doc.data(),
  //       });
  //     });
  //   });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
