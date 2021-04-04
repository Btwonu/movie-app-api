const cors = require('cors');
const express = require('express');

module.exports = (app) => {
  app.use(cors({ origin: true }));
  app.use(express.urlencoded({ extended: false }));
};
