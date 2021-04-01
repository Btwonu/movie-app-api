const { firestore } = require('../config/admin');

const movieService = require('./movieService');

const getAllCollections = async () => {
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

const getOneCollection = async (collectionId) => {
  let queryDocSnapshot = await firestore
    .doc(`/collections/${collectionId}`)
    .get();

  if (queryDocSnapshot.exists) {
    return queryDocSnapshot.data();
  } else {
    throw "Collection doesn't exist";
  }
};

const createCollection = () => {
  return true;
};

const getCollectionMovies = async (collectionId) => {
  let queryDocSnapshot = await firestore
    .doc(`/collections/${collectionId}`)
    .get();

  if (queryDocSnapshot.exists) {
    return queryDocSnapshot.data().movies;
  } else {
    throw "Collection doesn't exist";
  }
};

const addMovieToCollection = () => {
  return { done: true };
};

module.exports = {
  getAllCollections,
  getCollectionMovies,
  addMovieToCollection,
  createCollection,
  getOneCollection,
};
