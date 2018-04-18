const users = require("../users");
const posts = require("../posts");
const messages = require("../messages");

const requireLoginMiddleware = (req, res, next) => {
  if (req.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

const requireNoLoginMiddleware = (req, res, next) => {
  if (req.currentUser) {
    res.redirect("/home");
  } else {
    next();
  }
};

module.exports = app => {

  app.use("/login", requireNoLoginMiddleware);
  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", async (req, res) => {
    const sessionId = await users.loginUser(req.body.username, req.body.password);
    if (sessionId) {
      res
        .cookie("AuthCookie", sessionId)
        .redirect("/");
    } else {
      res.render("login", { error: "Invalud username/password provided" });
    }
  });

  app.use("/signup", requireNoLoginMiddleware);
  app.get("/signup", (req, res) => {
    res.render("signup")
  });

  app.use("/", requireLoginMiddleware);
  app.get("/", function (req, res) {
    const posts = posts.getPostsBySubscriptions(req.currentUser.subscriptions);
    res.render("home", {
      user: req.currentUser,
      posts: posts
    });
  });

  app.use("/messages/:username", requireLoginMiddleware);
  app.get("/messages/:username", async (req, res) => {
    const messages = messages.getMessagesConcerningUsers(req.currentUser, req.params.username);
    const otherUser = users.getUser(req.params.username);
    res.render("messages", {
      user: req.params.currentUser,
      other_user: req.params.otherUser,
      messages: messages
    });
  });

  app.use("/users/:username", requireLoginMiddleware);
  app.get("/users/:username", async (req, res) => {
    try {
      const user = users.getUser(req.params.username);
      const isCurrentUser = user.username === req.params.currentUser.username;
      res.render("profile", {
        user: user,
        isCurrentUser: isCurrentUser,
      });
    } catch (e) {
      res.render("profile", {
        missingUser: req.params.username
      });
    }
  });

}
