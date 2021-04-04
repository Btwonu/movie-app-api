const { admin, firestore } = require('../config/admin');

module.exports = (req, res, next) => {
  console.log('in middleware', req.headers.authorization);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      console.log('From authMiddleware:', req.user);
      return firestore
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      let { username } = data.docs[0].data();
      req.user.username = username;
      return next();
    })
    .catch((err) => {
      console.log('i broke in verifyidtoken catch');
      res.status(403).json({ error: err });
    });
};
