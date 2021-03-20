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

// Movie routes
app.get('/movies/popular', async (req, res) => {
  movieService.getPopular().then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/top-rated', (req, res) => {
  movieService.getTopRated().then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/upcoming', (req, res) => {
  movieService.getUpcoming().then((movies) => {
    res.json(movies);
  });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
