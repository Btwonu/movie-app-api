// Firebase
const functions = require('firebase-functions');
const firebase = require('./config/firebase');
const { admin, firestore } = require('./config/admin');

firebase.auth().useEmulator('http://localhost:9099');

// Server
const express = require('express');
const app = express();

// Services
const movieService = require('./services/movieService');
const { validateSignupData } = require('./validators/auth');

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

// Auth routes
app.post('/auth', (req, res) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  let { errors, valid } = validateSignupData(userData);

  if (!valid) return res.send(errors);

  firebase
    .auth()
    .createUserWithEmailAndPassword(userData.email, userData.password)
    .then((userCredential) => {
      let user = userCredential.user;
      res.send(user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
