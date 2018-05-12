const mongo = require('./mongo').collection;

async function createMessage (message, from_id, to_id) {
    const messages = await mongo("messages");

    const messageDoc = {
        "from" : from_id,
        "to" : to_id,
        "msg" : message,
        "time" : Date.now()
    };

    try {
        let res = await messages.insert(messageDoc);
        return res.insertedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function getMessagesConcerningUsers (userOne, userTwo) {
    const messages = await mongo("messages");

    try {
        users = [userOne, userTwo];
        mssgs = await messages.find({"from" : {"$in" : users}, "to" : {"$in" : users}}).sort({"time": 1}).limit(50).toArray();
        return mssgs;
    } catch (ex) {
        return [];
    }

}

module.exports = {
    createMessage,
    getMessagesConcerningUsers
};
