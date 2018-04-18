const mongo = require('./mongo');

async function createMessage (message, from_id, to_id) {
    mssg = {
        "from" : from_id,
        "to" : to_id,
        "mssg" : message,
        "time" : Date.now()
    };
}

async function getMessagesConcerningUsers (userOne, userTwo) {
    const messages = mongo("database", "messages");
    
    a2b = await messages.find({"from" : userOne, "to" : userTwo});
    b2a = await messages.find({"to" : userOne, "from" : userTwo});

    res = a2b + b2a;
    res.sort((a,b) => b.time - a.time);
    
    return res;
}

module.exports = {
    createMessage,
    getMessages
};

