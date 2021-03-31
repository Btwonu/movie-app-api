const { firestore } = require('../config/admin');

const getProfile = (userId) => {
  let user = {};

  return firestore
    .doc(`/users/${userId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw { user: 'User does not exist' };
      }

      user = doc.data();
      let collectionPromises = [];

      doc.data().createdCollections.forEach((collectionDocRef) => {
        collectionPromises.push(collectionDocRef.get());
      });

      return Promise.all(collectionPromises).then((resultsArr) => {
        return resultsArr.map((queryDocSnapshot) => queryDocSnapshot.data());
      });
    })
    .then((collectionsArr) => {
      user.createdCollections = collectionsArr;
      return user;
    });
};

module.exports = {
  getProfile,
};
