const mongo = require('./mongo').collection;
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const saltRounds = 4;

async function getUser (username) {
    // Get the user collection
    const users = await mongo("users");

    // Get the user
    try {
        let user = await users.findOne({"username" : username});

        // We will hide the password data
        user.password = undefined;

        return user;
    } catch (ex) {
        return undefined;
    }
}

async function getUserBySessionId (sessionId) {
    // Get the sessions collection
    const sessions = await mongo("sessions");

    // Get the session
    try {
        let session = await sessions.findOne({"_id" : sessionId});
        return getUser(session.username);
    } catch (ex) {
        return undefined;
    }
}

async function createUser (user) {
    // Get the user collection
    const users = await mongo("users");

    // No sessions by default
    user.sessions = [];
    user.subscriptions = [];
    user.password = await bcrypt.hash(user.password, saltRounds);

    // Add the user
    try {
        let userExists = await getUser(user.username);
        if (userExists) {
          return false;
        } else {
          let res = await users.insert(user);
          return res.insertedCount > 0;
        }
    } catch (ex) {
        return false;
    }
}

async function updatePassword (user, newPassword) {
    // Get the user collection
    const users = await mongo("users");
    const hash = await bcrypt.hash(newPassword, saltRounds);

    try {
        let res = await users.updateOne({ username: user}, { $set: { password: hash }});
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function updateUserProfile (user, newProfile) {
    // Get the user collection
    const users = await mongo("users");

    try {
        let res = await users.updateOne({ username: user }, { $set: newProfile });
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function checkPassword(username, password) {
    if (typeof username != "string")
        return false;

    // Get the user collection
    const users = await mongo("users");

    // Get the user
    try {
        let user = await users.findOne({"username" : username});

        return bcrypt.compare(password, user.password);
    } catch (ex) {
        return false;
    }
}

async function loginUser (username, password) {
    if (typeof username != "string")
        return false;

    // Get the user collection
    const users = await mongo("users");

    // Get the user
    try {
        let user = await users.findOne({"username" : username});

        let valid = await bcrypt.compare(password, user.password);

        if (valid) {
            // Create an id for the session.
            let sess_id = uuid();

            // Add to the session list
            const sessions = await mongo("sessions");
            sessions.insert({"_id" : sess_id, "username" : username});

            return sess_id;
        } else
            return undefined;

    } catch (ex) {
        return undefined;
    }
}

async function logoutUser (sessionId) {
    // Get the user collection
    const users = await mongo("users");

    try {
        // Remove the session
        const sessions = await mongo("sessions");

        return await sessions.deleteOne({"_id" : sessionId});
    } catch (ex) {
        return false;
    }
}

async function getAllUsers(){
    const users = await mongo("users");
    return await users.find().toArray();
}

async function addSubscription (username, userToSub) {
    if (typeof username != "string")
        return false;
    else if (typeof userToSub != "string")
        return false;

    // Get the user collection
    const users = await mongo("users");

    try {
        let res = await users.update({"username" : username}, {"$push" : {"subscriptions" : userToSub}});
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function removeSubscription (username, userToUnsub) {
    if (typeof username != "string")
        return false;
    else if (typeof userToUnsub != "string")
        return false;

    // Get the user collection
    const users = await mongo("users");

    // Remove the item
    try {
        let res = await users.update({"username" : username}, {"$pull" : {"subscriptions" : userToUnsub}});
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

module.exports = {
    getUser,
    getUserBySessionId,
    getAllUsers,
    createUser,
    updatePassword,
    updateUserProfile,
    checkPassword,
    loginUser,
    logoutUser,
    addSubscription,
    removeSubscription
};

