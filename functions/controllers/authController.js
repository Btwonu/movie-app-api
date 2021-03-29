const { Router } = require('express');
const firebase = require('../config/firebase');
const { admin, firestore } = require('../config/admin');

const { validateSignupData, validateLoginData } = require('../validators/auth');

const router = Router();

// Auth routes
router.post('/register', (req, res) => {
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
      console.log('in here:', err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already is use' });
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' });
      }
    });
});

router.post('/login', (req, res) => {
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

module.exports = router;
