const mongo = require('./mongo');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

async function getUser (username) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    // Get the user
    try {
        let user = await users.findOne({"username" : username});

        // We will hide the password data
        user.passwd = undefined;

        return user;
    } catch (ex) {
        return undefined;
    }
}

async function createUser (user) {
    // Get the user collection
    const users = await mongo("database", "users");

    // No sessions by default
    user.sessions = []

    // Add the user
    try {
        let res = await users.insert(user);
        return res.nInserted > 0;
    } catch (ex) {
        return false;
    }
}

async function updateProfile (user, profileChanges) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    try {
        let res = await users.updateOne(user, profileChanges);
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function loginUser (username, password) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    // Get the user
    try {
        let user = await users.findOne({"username" : username});

        let valid = await bcrypt.compare(password, phash);

        if (valid) {
            // Create an id for the session.
            sess_id = uuid();
            
            // Add to the session list
            const sessions = await mongo("database", "sessions");
            users.update({"username" : username}, {"$push" : { "sessions" : sess_id }});
            sessions.insert({"_id" : sess_id, "username" : username});
            
            return sess_id;
        } else
            return undefined;

    } catch (ex) {
        return undefined;
    }
}

async function logoutUser (username, sessionId) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    try {
        // Remove the session 
        const sessions = await mongo("database", "sessions");

        let res = await users.update({"username" : username}, {"$pull" : { "sessions" : sessionId }});

        // If there were no users, we did not logout.
        if (res.nModified == 0)
            return false;

        res = await sessions.remove({"_id" : sess_id});
        return res.nRemoved > 0;
    } catch (ex) {
        return false;
    }
}

async function addSubscription (username, userToSub) {
    // Get the user collection
    const users = await mongo("database", "users");
    if (users === undefined)
        return;
    
    try {
        let res = await users.update({"username" : username}, {"$push" : {"subscription_list" : userToSub["_id"]}});
        return res.nModified > 0;
    } catch (ex) {
        return false;
    }
}

async function removeSubscription (username, userToUnsub) {
    // Get the user collection
    const users = await mongo("database", "users");

    // Remove the item
    try {
        let res = await users.update({"username" : username}, {"$pull" : {"subscription_list" : userToUnsub["_id"]}});
        return res.nModified > 0;
    } catch (ex) {
        return false;
    }
}

module.exports = {
    getUser,
    createUser,
    updateProfile,
    loginUser,
    logoutUser,
    addSubscription,
    removeSubscription
};

