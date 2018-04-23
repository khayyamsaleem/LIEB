const mongo = require('./mongo');

async function createPost (post) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // Set the post time
    post.post_time = post.update_time = Date.now();

    // Set initial reactions
    post.reactions = []

    try {
        // Add the user
        let res = await posts.insert(post);
        
        return res.nInserted > 0;
    } catch (ex) {
        return false;
    }
}

async function getPostsBySubscriptions (subscriptions) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // Gather all posts
    return await posts.find({"poster" : {"$in" : subscriptions}}).sort({"post_time" : 1});
}

async function deletePost (postId) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    try {
        // Perform the removal
        let res = await posts.remove({"_id": postId});

        // Check whether or not something was removed
        return res.nRemoved > 0;
    } catch (ex) {
        return false;
    }
}

async function updatePost (postId, newContent) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // The update consists of new content and an updated timestamp
    update = {"content" : newContent, "update_time" : Date.now()};

    try {
        // Apply the update
        let res = await posts.updateOne({"_id" : postId}, update);
        
        // Return whether or not something was modified
        return res.modifiedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function addReactionToPost (postId, username, reactionType) {
    const posts = await mongo("database", "posts");
    
    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : postId});

    if (post.reactions.indexOf(reactionType) < 0) {
        // Modify the reactions
        post.reactions.push({"reactionType" : reactionType, "username" : username});
        
        // Update the reactions
        return await updatePost(postId, post);
    } else
        return false;
}

async function removeReactionFromPost (postId, username, reactionType) {
    const posts = await mongo("database", "posts");
    
    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : postId});
    
    let idx = post.reactions.indexOf(reactionType);
    if (idx >= 0) {
        post.reactions.splice(idx, 1);

        // Update the reactions
        return await updatePost(postId, post);
    } else
        return false;
}
