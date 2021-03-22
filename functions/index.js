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
const { validateSignupData, validateLoginData } = require('./validators/auth');

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
app.post('/auth/register', (req, res) => {
  let { username, email, password, confirmPassword } = req.body;

  let { errors, valid } = validateSignupData(
    username,
    email,
    password,
    confirmPassword
  );

  if (!valid) return res.send(errors);

  let JWT, userId;

  firestore
    .doc(`/users/${username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: 'This username is already taken' });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      }
    })
    .then((userCredential) => {
      userId = userCredential.user.uid;
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      res.json(token);
      JWT = token;

      let newUser = {
        userId,
        username,
        email,
        createdAt: new Date().toISOString(),
        avatar: '',
        friends: [],
        createdCollections: [],
        followedCollections: [],
        likedMovies: [],
      };

      return firestore.doc(`/users/${username}`).set(newUser);
    })
    .then(() => {
      return res.status(201).json({ JWT });
    })
    .catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already is use' });
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' });
      }
    });
});

app.post('/auth/login', (req, res) => {
  let { email, password } = req.body;

  let { errors, valid } = validateLoginData(email, password);

  if (!valid) return res.send(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
