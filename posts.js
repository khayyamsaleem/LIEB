const mongo = require('./mongo').collection;
const mongodb = require('mongodb')

async function createPost (post) {
    // Basic validation
    if (post === undefined){
        return false;
    } else if (post.content === undefined || typeof post.content != "string"){
        return false;
    }else if (post.poster === undefined){
        return false;
    }

    // Get the user collection
    const posts = await mongo("posts");

    // Set the post time
    post.post_time = post.update_time = Date.now();

    // Add "missing" items
    if (post.attachments === undefined) post.attachments = [];
    if (post.reactions === undefined) post.reactions = { like: [], hate: [] };

    try {
        // Add the user
        let res = await posts.insert(post);
        return res.insertedCount > 0;
    } catch (ex) {
        return false;
    }
}

async function getPostsBySubscriptions (subscriptions) {
    // Get the user collection
    const posts = await mongo("posts");

    console.log(subscriptions);
    // Gather all posts
    let postsBySubscriptions = await posts.find({"poster" : {"$in" : subscriptions}}).sort({"post_time" : 1}).toArray();

    return postsBySubscriptions.map((post) => {
      post.post_time = new Date(post.post_time * 1000).toString();
      post.update_time = new Date(post.update_time * 1000).toString();
      return post;
    });
}

async function getPostById(postId) {
    const post = await mongo("posts");
    return await post.findOne({"_id" : new mongodb.ObjectId(postId)});
}

async function deletePost (postId) {
    // Get the user collection
    const posts = await mongo("posts");

    try {
        // Perform the removal
        let res = await posts.remove({"_id": new mongodb.ObjectId(postId)});

        // Check whether or not something was removed
        return res.result.n > 0;
    } catch (ex) {
        return false;
    }
}

async function updatePost (postId, newContent) {
    // Minimum validation
    if (typeof newContent != "string")
        return false;

    // Get the user collection
    const posts = await mongo("posts");

    // The update consists of new content and an updated timestamp
    update = {"content" : newContent, "update_time" : Date.now()};

    try {
        // Apply the update
        let res = await posts.updateOne({"_id" : new mongodb.ObjectId(postId)}, update);

        // Return whether or not something was modified
        return res.nModified > 0;
    } catch (ex) {
        return false;
    }
}

async function addReactionToPost (postId, username, reactionType) {
    if (typeof username != "string") return false;

    const posts = await mongo("posts");

    console.log(postId);
    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : new mongodb.ObjectId(postId)});

    // Modify the reactions
    post.reactions[reactionType].push(username);

    // Update the reactions
    try {
      let res = await posts.updateOne({"_id": new mongodb.ObjectId(postId)}, { "$set": { "reactions": post.reactions }});
      return res.nModified > 0;
    } catch (ex) {
      console.log(ex);
      return false;
    }
}

async function removeReactionFromPost (postId, username, reactionType) {
    if (typeof username != "string") return false;

    const posts = await mongo("posts");

    // Add a new reaction to the list of reactions
    let post = await posts.findOne({"_id" : new mongodb.ObjectId(postId)});

    post.reactions[reactionType] = post.reactions[reactionType].filter((name) => { return username !== name});
    // Update the reactions
    try {
      let res = await posts.updateOne({"_id": new mongodb.ObjectId(postId)}, { "$set": { "reactions": post.reactions }});
      return res.nModified > 0;
    } catch (ex) {
      return false;
    }
}

module.exports = {
  createPost,
  getPostsBySubscriptions,
  getPostById,
  deletePost,
  updatePost,
  addReactionToPost,
  removeReactionFromPost
};
