const { firestore } = require('../config/admin');

const getAll = async () => {
  let documents = await firestore
    .collection('/collections')
    .get()
    .then((querySnapshot) => querySnapshot.docs);

  let collectionsArray = documents.map(async (queryDocSnapshot) => {
    let collection = queryDocSnapshot.data();

    let creator = await queryDocSnapshot
      .data()
      .creator.get()
      .then((creatorSnapshot) => ({
        userId: creatorSnapshot.data().userId,
        username: creatorSnapshot.data().username,
      }));

    collection.collectionId = queryDocSnapshot.id;
    collection.creator = creator;

    return collection;
  });

  return Promise.all(collectionsArray);
};

const create = () => {};

module.exports = {
  getAll,
  create,
};
