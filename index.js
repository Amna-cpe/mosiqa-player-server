const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const { db } = require("./util/firebase");
const { signup, logIn , getUserData } = require("./handlers/user");
const {
  getSongs,
  searchSongs,
  likeSong,
  uploadSong,
} = require("./handlers/songs");
const Auth  = require("./util/Auth");

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// SIGN UP
app.post("/signup", signup);

// LOGIN
app.post("/login", logIn);

// GET USER DATA
app.get('/user',Auth , getUserData)

// GET ALL THE SONGS
app.get("/getSongs", getSongs);

// SEARCH FOR A SONG
app.post("/searchSongs", searchSongs);

// LIKE UNLIKE A SONG
app.post("/likeSong/:songId", Auth,likeSong);

// UPLOAD A SONG

app.post("/upload", Auth , upload.single("audio"), uploadSong);


app.listen(4000, () => {
  console.log("serving at port 4000");
});
