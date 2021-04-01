const { firestore } = require('../config/admin');

// const getProfile = (userId) => {
//   let user = {};

//   return firestore
//     .doc(`/users/${userId}`)
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         throw { user: 'User does not exist' };
//       }

//       user = doc.data();
//       let collectionPromises = [];

//       doc.data().createdCollections.forEach((collectionDocRef) => {
//         console.log({ collectionId: collectionDocRef.id });
//         collectionPromises.push(collectionDocRef.get());
//       });

//       return Promise.all(collectionPromises).then((resultsArr) => {
//         return resultsArr.map((queryDocSnapshot) => queryDocSnapshot.data());
//       });
//     })
//     .then((collectionsArr) => {
//       user.createdCollections = collectionsArr;
//       return user;
//     });
// };

const getProfile = async (userId) => {
  let userDoc = await firestore.doc(`/users/${userId}`).get();

  if (!userDoc.exists) {
    throw { user: 'User does not exist' };
  }

  let user = userDoc.data();

  let collectionArray = user.createdCollections.map(
    async (collectionDocRef) => {
      let queryDoc = await collectionDocRef.get();
      let collection = queryDoc.data();
      collection.collectionId = collectionDocRef.id;
      console.log({ collection });

      return collection;
    }
  );

  user.createdCollections = await Promise.all(collectionArray).then(
    (resultsArr) => resultsArr
  );

  return user;
};

module.exports = {
  getProfile,
};
