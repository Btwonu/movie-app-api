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
});

// Movie routes
app.get('/movies', (req, res) => {
  let { category, page, limit } = req.query;

  if (!category) {
    movieService.getCategories().then((results) => {
      res.json(results);
    });
  }

  console.log({ category });
  movieService.getMovies(category, page, limit).then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/popular', async (req, res) => {
  movieService.getPopular().then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/top_rated', (req, res) => {
  movieService.getTopRated().then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/upcoming', (req, res) => {
  movieService.getUpcoming().then((movies) => {
    res.json(movies);
  });
});

app.get('/movies/:movieId', (req, res) => {
  let { movieId } = req.params;

  movieService.getOne(movieId).then((data) => {
    res.json(data);
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

// Users routes
app.get('/users', (req, res) => {
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

app.get('/users/:username', (req, res) => {
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

app.get('/users/:username/collections', (req, res) => {
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

app.get('/users/users/:userId/friends', (req, res) => {
  res.send(req.params.userId);
});

// Collections routes
app.get('/collections', (req, res) => {
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

app.post('/collections', (req, res) => {
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

exports.api = functions.region('europe-west1').https.onRequest(app);
