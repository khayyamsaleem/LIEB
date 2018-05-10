const posts = require('../posts');
module.exports = app => {

  // Posts
  app.post("/posts", (req, res) => {
    // TODO: create a new post
    const p = {
        title: req.body.title,
        poster: req.body.poster,
        content: req.body.content,
        attachments: req.body.attachments,
    }
    const chk = await posts.createPost(p)
    if (chk) res.status(200).end()
    else res.status(500).json({err: "unable to add post to database"});
  });

  app.put("/posts/:postId", (req, res) => {
    // TODO: update a post's content
  });

  app.post("/posts/:postId/react", (req, res) => {
    // TODO: react to a post
  });

  app.delete("/posts/:postId/react", (req, res) => {
    // TODO: remove reaction to a post
  });

  app.delete("/posts/:postId", (req, res) => {
    // TODO: delete a post
  });

  // Messages
  app.post("/messages/:toUser", (req, res) => {
    // TODO: create a new message from the currently logged in
    // user to the user in the url
  });

}
