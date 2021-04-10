const admin = require('firebase-admin');

if (process.env.FUNCTIONS_EMULATOR) {
  const serviceAccount = require('../service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp();
}

const firestore = admin.firestore();

module.exports = { admin, firestore };
