const client = require('mongodb').MongoClient;

// The connection info
let _connection = undefined;
let _db = undefined;

// Gets the database connection
async function get(db_name, coll_name) {
    if (_connection === undefined) {
        console.log("Connecting to db...");
        _connection = await client.connect("mongodb://localhost:27017");
        console.log("Accessing database...");
        _db = await _connection.db(db_name);
    }

    console.log("Accessing collection...");
    return await _db.collection(coll_name);
}

module.exports = get;

