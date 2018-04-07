module.exports = app => {

  // Auth
  app.post("/login", (req, res) => {
    // TODO: login the user
  });

  app.get("/logout", (req, res) => {
    // TODO: logout the user
  });

  // Users
  app.post("/users/:username", (req, res) => {
    // TODO: create a new user
  });

  app.delete("/users/:username", (req, res) => {
    // TODO: delete a user
  });

  // Posts
  app.post("/posts", (req, res) => {
    // TODO: create a new post
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
