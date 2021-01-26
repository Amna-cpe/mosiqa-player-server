const firebase = require("firebase");

 

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.KEY_INITIALIZE,
  authDomain: "mosiqa-player.firebaseapp.com",
  projectId: "mosiqa-player",
  storageBucket: "mosiqa-player.appspot.com",
  messagingSenderId: process.env.MSG_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MSMNT_ID,
});


 const db = firebaseApp.firestore();


module.exports = {db , firebaseApp }
