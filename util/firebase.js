const firebase = require("firebase");

 const data = process.env.KEY_INITIALIZE;
 const jsoninitializeApp = JSON.parse(data);

const firebaseApp = firebase.initializeApp(jsoninitializeApp);


 const db = firebaseApp.firestore();


module.exports = {db , firebaseApp }
