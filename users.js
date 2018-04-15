const mongo = require('./mongo');

async function getUser (username) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    // Get the user
    try {
        return await users.findOne({"username" : username});
    } catch (ex) {
        return undefined;
    }
}

async function createUser (user) {
    // Get the user collection
    const users = await mongo("database", "users");

    // Add the user
    users.insert(user);
}

async function updateProfile (user, profileChanges) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    users.updateOne(user, profileChanges);
    
}

async function loginUser (username, password) {

}

async function logoutUser (username, sessionId) {

}

async function addSubscription (username, userToSub) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    // Get the user
    let user = await getUser(username);

    if (user.subscription_list.indexOf(userToSub) < 0) {
        // Add the subscriber
        user.subscription_list.push(userToSub);
        
        // Generate and apply the update
        let update = {"subscription_list" : user.subscription_list};
        updateProfile({"username" : username}, update);
    }

}

async function removeSubscription (username, userToUnsub) {
    // Get the user collection
    const users = await mongo("database", "users");
    
    // Get the user
    let user = await getUser(username);
    
    let idx = user.subscription_list.indexOf(userToSub);
    if (idx >= 0) {
        // Remove the item
        user.subscription_list.splice(idx, 1);

        // Generate and apply the update
        let update = {"subscription_list" : user.subscription_list};
        updateProfile({"username" : username}, update);
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

