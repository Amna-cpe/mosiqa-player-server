const { admin } = require("./admin");
const { db } = require("./firebase");

module.exports = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.log("No Token Found");
    return res.status(403).json({ error: "Unauthenticated" });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    .catch((err) => {
      console.log("Error while verifyinh");
      return res.json(err);
    });
};
