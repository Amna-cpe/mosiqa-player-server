const { db, firebaseApp, storage } = require("../util/firebase");
const { mosiqaBucket } = require("../util/storage");

exports.getSongs = (req, res) => {
  // GET ALL THE SONGS
  db.collection("songs")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let songs = [];
      data.forEach((doc) => {
        songs.push({
          username: doc.data().username,
          songName: doc.data().songName,
          songUrl: doc.data().songUrl,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          songId: doc.id,
        });
      });
      return res.json(songs);
    })
    .catch((err) => console.log(err));
};

exports.searchSongs = (req, res) => {
  // USER CAN SEARCH VIA SONG NAME OR USER NAME THAT UPLOADS
  const SongToSearchFor = req.body.search;

  console.log(req.body)

  db.collection("songs")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let songs = [];

      data.forEach((doc) => {
        console.log("usernaem", doc.data().username);
        if (
          SongToSearchFor === doc.data().songName ||
          SongToSearchFor === doc.data().username ||
          doc.data().songName.includes(SongToSearchFor) ||
          doc.data().songName.toLowerCase().includes(SongToSearchFor.toLowerCase())
        ) {
          songs.push({
            username: doc.data().username,
            songName: doc.data().songName,
            songUrl: doc.data().songUrl,
            likeCount: doc.data().likeCount,
            createdAt: doc.data().createdAt,
            songId: doc.id,
          });
        }
      });
     
      if (songs.length > 0) {
        return res.json(songs);
      } else {
        return res.status(400).json({ error: "No Results Matching" });
      }
    })
    .catch((err) =>{
      console.log(err)
    });
};

exports.likeSong = (req, res) => {

  console.log("the params ",req.params.songId)
  //GET THE LIKE (doc)
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("songId", "==", req.params.songId)
    .limit(1);

  // GET THE DOC
  const songDocument = db.doc(`/songs/${req.params.songId}`);

  let songData;
  songDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        songData = doc.data();
        songData.songId = doc.id;

        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "song not found" });
      }
    })
    // the like document
    .then((data) => {
      console.log(data.empty);

      if (data.empty) {
        //create it and increse the likeCount
        return db
          .collection("likes")
          .add({
            username: req.user.username,
            songId: req.params.songId,
          })
          .then(() => {
            songData.likeCount++;
            return songDocument.update({ likeCount: songData.likeCount });
          })
          .then(() => {
            return res.json(songData);
          });
      } else {
        // remove it and decrese the likeCount
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            songData.likeCount--;
            return songDocument.update({ likeCount: songData.likeCount });
          })
          .then(() => {
            return res.json(songData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.uploadSong = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No File Selected");
  } else {
    // upload the song to the storage
    const blob = mosiqaBucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => console.log(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        mosiqaBucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;

      const newSong = {
        createdAt: new Date().toISOString(),
        likeCount: 0,
        songName: req.file.originalname,
        songUrl: publicUrl,
        username: req.user.username,
      };
      let newSongData;

      db.collection("songs")
        .add(newSong)
        .then((doc) => {
          newSongData = newSong;
          newSongData.songId = doc.id;
          return db.doc(`/users/${req.user.username}`).get();
        })
        .then((doc) => {
          let userData = doc.data();
          userData.songsCount++;
          return db
            .doc(`/users/${req.user.username}`)
            .update({ songsCount: userData.songsCount });
        })
        .then(() => {
          return res.send(newSongData);
        });
    });

    blobStream.end(req.file.buffer);
  }
};


