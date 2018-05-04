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
    res.redirect("/");
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
      res.render("login", { error: "Invalid username/password provided" });
    }
  });

  app.use("/signup", requireNoLoginMiddleware);
  app.get("/signup", (req, res) => {
    res.render("signup")
  });

  app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    const errors = [];

    if (username === undefined || username === "") {
      errors.push('Username must be provided');
    }

    if (password === undefined || password === "") {
      errors.push('Password must be provided');
    }

    if (passwordConfirm === undefined || passwordConfirm === "") {
      errors.push('Password confirmation must be provided');
    }

    if (password && passwordConfirm && password !== "" && passwordConfirm !== ""
      && password !== passwordConfirm) {
      errors.push('Password must match password confirmation');
    }

    if (errors.length > 0) {
      res.render("signup", {
        errors: errors
      })
    } else {
      try {
        const userToCreate = {
          username: username,
          password: password
        };

        const createdUser = await users.createUser(userToCreate);
        if (createdUser) {
          res.redirect("/");
        } else {
          res.render("signup", {
            errors: ['Failed to create user.']
          });
        }
      } catch (e) {
        res.render("signup", {
          errors: [`Failed to create user, error: ${e}`]
        });
      }
    }
  });

  app.use("/", requireLoginMiddleware);
  app.get("/", function (req, res) {
    const postsBySubscription = posts.getPostsBySubscriptions(req.currentUser.subscriptions);
    res.render("home", {
      user: req.currentUser,
      posts: postsBySubscription
    });
  });

  app.use("/messages/:username", requireLoginMiddleware);
  app.get("/messages/:username", async (req, res) => {
    const messages = messages.getMessagesConcerningUsers(req.currentUser, req.params.username);
    const otherUser = users.getUser(req.params.username);
    res.render("messages", {
      user: currentUser,
      other_user: otherUser,
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
