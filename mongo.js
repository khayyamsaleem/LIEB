const client = require('mongodb').MongoClient;
const mongoSettings = require('./mongoSettings.json')

// The connection info
let _connection = undefined;
let _db = undefined;

async function connect () {
  if (_connection === undefined) {
      console.log("Connecting to db...");
      _connection = await client.connect(mongoSettings.serverUrl);
      _db = await _connection.db(mongoSettings.database);
  }
}

// Gets a database collection.
async function collection (coll_name) {
    if (_connection === undefined) {
      await connect();
    }

    return await _db.collection(coll_name);
}

async function clear () {
    if (_connection === undefined) {
      await connect();
    }

    return await _db.dropDatabase();
}

module.exports = {
  collection,
  clear
};
