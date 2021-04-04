const functions = require('firebase-functions');
const routes = require('./routes');

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
