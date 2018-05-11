const posts = require('../posts');
const fileUpload = require('express-fileupload');
module.exports = app => {

  app.use(fileUpload());
  // Posts
  app.post("/posts", async (req, res) => {
    const p = {
        title: req.body.title,
        poster: req.body.poster,
        content: req.body.content,
        attachments: []
    }
    if (req.files)
      p.attachments.push(req.files.att);
    const chk = await posts.createPost(p)
    if (chk) res.status(200).end()
    else res.status(500).json({err: "unable to add post to database"});
  });

  app.put("/posts/:postId", async (req, res) => {
    const p_id = req.params.postId;
    const new_content = req.body.content;
    const updated = await posts.updatePost(p_id, new_content);
    if (updated) res.status(200).end()
    else res.status(500).json({err: "unable to update post"})
  });

  app.post("/posts/:postId/react", async (req, res) => {
    const p_id = req.params.postId;
    const r = req.body.reaction;
    const u = req.params.currentUser.username;
    const chk = await posts.addReactionToPost(p_id, u, r);
    if (chk) res.status(200).end();
    else res.status(500).json({err: "unable to add reaction to post"});
  });

  app.delete("/posts/:postId/react", async (req, res) => {
    const p_id = req.params.postId;
    const r = req.body.reaction;
    const u = req.params.currentUser.username;
    const chk = await posts.removeReactionFromPost(p_id, u, r);
    if (chk) res.status(200).end()
    else res.status(500).json({err: "unable to remove reaction from post"});
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
