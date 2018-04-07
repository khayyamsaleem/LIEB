const client = require('mongodb').MongoClient;

const settings = require("./settings");

// The connection info
let _connection = undefined;
let _db = undefined;

// Gets the database connection
async function get() {
    if (_connection === undefined) {
        console.log("Connecting to db...");
        _connection = await client.connect(settings.dbconf.url);
        console.log("Accessing database...");
        _db = await _connection.db(settings.dbconf.db);
    }

    console.log("Accessing collection...");
    return await _db.collection(settings.dbconf.collection);
}

module.exports = get;

