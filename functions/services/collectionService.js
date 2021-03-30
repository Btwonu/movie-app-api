const { firestore } = require('../config/admin');

const getAll = () => {
  return firestore
    .collection('/collections')
    .get()
    .then((querySnapshot) => {
      let docs = querySnapshot.docs;
      let arrOfDocs = [];

      for (let doc of docs) {
        let collection = { collectionId: doc.id, ...doc.data() };
        arrOfDocs.push(collection);
      }

      return arrOfDocs;
    });
};

const create = () => {};

module.exports = {
  getAll,
  create,
};
