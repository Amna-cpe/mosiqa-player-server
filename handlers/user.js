const {
  validateSignUpData,
  validateSignInData,
} = require("../util/validators");
const { db, firebaseApp } = require("../util/firebase");

exports.signup = (req, res) => {
  console.log(req.body);
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  const { errors, valid } = validateSignUpData(newUser);
  let token, userId;
  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists)
        return res.status(400).json({ username: "Username Already taken" });
      else
        return firebaseApp
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((_token) => {
      token = _token;
      const userCredentials = {
        username: newUser.username,
        songsCount: 0,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json(token );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

//LOGIN
exports.logIn = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { errors, valid } = validateSignInData(user);
  if (!valid) return res.status(400).json(errors);

  firebaseApp
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json(token);
    })
    .catch((err) => {
      if ((err.code = "auth/user-not-found"))
        return res
          .status(403)
          .json({ general: "wrong credentials please try again" });
      if ((err.code = "auth/wrong-password"))
        return res
          .status(403)
          .json({ general: "wrong credentials please try again" });
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUserData = (req, res) => {
  let userData = {}; //holds credential and likes
  db.doc(`users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data(); //save
        return db
          .collection("likes")
          .where("username", "==", req.user.username)
          .get(); //get all the likes for user
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data()); //save all the likes(arrays) in array
      });
      return res.json(userData);
    })

    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};
