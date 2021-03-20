// Firebase
const functions = require('firebase-functions');
const { admin, firestore } = require('./config/admin');

// Server
const express = require('express');
const app = express();

// Init
require('./config/express')(app);

app.get('/', (req, res) => {
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

exports.api = functions.region('europe-west1').https.onRequest(app);
