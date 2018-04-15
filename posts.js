const mongo = require('./mongo');

async function createPost (post) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // Set the post time
    post.post_time = post.update_time = Date.now();

    // Set initial reactions
    post.reactions = []

    // Add the user
    posts.insert(post);
}

async function getPostsBySubscriptions (subscriptions) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // Gather all posts
    return await await posts.find({"poster" : {"$in" : subscriptions}}).sort({"post_time" : 1});
}

async function deletePost (postId) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // Perform the removal
    posts.remove({"_id": postId});
}

async function updatePost (postId, newContent) {
    // Get the user collection
    const posts = await mongo("database", "posts");
    
    // The update consists of new content and an updated timestamp
    update = {"content" : newContent, "update_time" : Date.now()};

    // Apply the update
    posts.updateOne({"_id" : postId}, update);
}

async function addReactionToPost (postId, username, reactionType) {
    const posts = await mongo("database", "posts");
    
    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : postId});

    if (post.reactions.indexOf(reactionType) < 0) {
        // Modify the reactions
        post.reactions.push({"reactionType" : reactionType, "username" : username});
        
        // Update the reactions
        updatePost(postId, post);
    }
}

async function removeReactionFromPost (postId, username, reactionType) {
    const posts = await mongo("database", "posts");
    
    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : postId});
    
    let idx = post.reactions.indexOf(reactionType);
    if (idx >= 0) {
        post.reactions.splice(idx, 1);

        // Update the reactions
        updatePost(postId, post);
    }
}
