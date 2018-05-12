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
        console.log(ex);
        return false;
    }
}

async function getMessagesConcerningUsers (userOne, userTwo) {
    const messages = await mongo("messages");

    try {
        // a2b = await messages.find({"from" : userOne, "to" : userTwo});
        // b2a = await messages.find({"to" : userOne, "from" : userTwo});
        users = [userOne, userTwo];
        mssgs = await messages.find({"from" : {"$in" : users}, "to" : {"$in" : users}}).sort({"time": 1}).limit(50).toArray();
        return mssgs;
    } catch (ex) {
        console.log("this happened")
        return [];
    }

    // res = Array.concat(a2b, b2a);
    // res.sort((a,b) => b.time - a.time);

}

async function getMessagees(from) {
    const messages = await mongo("messages");

    try {
        const m = await messages.find({ from });
        const tos = [...new Set(m.map(x => m.to))];
        return tos;
    } catch (ex) {
        return [];
    }
}

module.exports = {
    createMessage,
    getMessagesConcerningUsers
};

