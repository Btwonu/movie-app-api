const { Router } = require('express');
const firebase = require('../config/firebase');
const { admin, firestore } = require('../config/admin');

const { validateSignupData, validateLoginData } = require('../validators/auth');

const router = Router();

const authService = require('../services/authService');

// Auth routes
router.post('/register', (req, res) => {
  let { username, email, password, confirmPassword } = req.body;

  let { errors, valid } = validateSignupData(
    username,
    email,
    password,
    confirmPassword
  );

  if (!valid) return res.json(errors);

  let JWT, userId, userInfo;

  firestore
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .get()
    .then((data) => {
      if (data.docs.length > 0) {
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

      userInfo = {
        userId,
        username,
        email,
        createdAt: new Date().toISOString(),
        avatar: '',
        createdCollections: [],
      };

      return firestore.doc(`/users/${userId}`).set(userInfo);
    })
    .then(() => {
      return res.status(201).json({ userInfo, JWT });
    })
    .catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already is use' });
      } else {
        console.log(err);
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' });
      }
    });
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  let { errors, valid } = validateLoginData(email, password);

  if (!valid) return res.json(errors);

  let JWT, userId;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userId = userCredential.user.uid;

      return userCredential.user.getIdToken();
    })
    .then((token) => {
      JWT = token;

      return authService.getProfile(userId);
    })
    .then((userInfo) => {
      res.json({ userInfo, JWT });
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
