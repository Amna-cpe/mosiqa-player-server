const { Storage } = require("@google-cloud/storage");
const path = require('path')


const data = process.env.KEY_JSON;
const jsonCredential = JSON.parse(data);

const storage = new Storage({
    keyFilename:path.join(__dirname ,jsonCredential),
    projectId:"mosiqa-player"
});

const mosiqaBucket = storage.bucket('mosiqa-player.appspot.com')

module.exports = {mosiqaBucket}



