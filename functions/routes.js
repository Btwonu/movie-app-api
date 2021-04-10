const { Router } = require('express');

const authMiddleware = require('./middleware/authMiddleware');
const moviesController = require('./controllers/moviesController');
const authController = require('./controllers/authController');
const usersController = require('./controllers/usersController');
const collectionsController = require('./controllers/collectionsController');

const router = Router();

router.use('/movies', moviesController);
router.use('/auth', authController);
router.use('/users', usersController);
router.use('/collections', authMiddleware, collectionsController);

module.exports = router;
