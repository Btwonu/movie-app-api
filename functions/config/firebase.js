const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyC9imxdDkHUgZhYKqbWqbC4jM8YpOzQQjc',
  authDomain: 'movie-find-dev.firebaseapp.com',
  projectId: 'movie-find-dev',
  storageBucket: 'movie-find-dev.appspot.com',
  messagingSenderId: '685460647316',
  appId: '1:685460647316:web:63f28e4fa0ad69260b7381',
};

firebase.initializeApp(config);

module.exports = firebase;
