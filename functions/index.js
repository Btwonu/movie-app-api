// Firebase
const functions = require('firebase-functions');
const firebase = require('./config/firebase');
const { admin, firestore } = require('./config/admin');
const routes = require('./routes');

firebase.auth().useEmulator('http://localhost:9099');
// firestore.useEmulator('localhost', 8080);

// Server
const express = require('express');
const app = express();

// Init
require('./config/express')(app);

app.get('/', (req, res) => {
  res.send({
    hello: 'hello',
  });
});

app.use(routes);

exports.api = functions.region('europe-west1').https.onRequest(app);
