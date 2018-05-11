const users = require("../users");
const posts = require("../posts");
const messages = require("../messages");
const middleware = require("../middleware");

module.exports = app => {

  app.use("/login", middleware.requireNoLoginMiddleware);
  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.use("/posts_form", middleware.requireLoginMiddleware);
  app.get("/posts_form", (req, res) => {
    res.render("post");
  })

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

  app.get("/logout", async (req, res) => {
    await users.logoutUser(req.cookies.AuthCookie);
    res.redirect('/login');
  })

  app.use("/signup", middleware.requireNoLoginMiddleware);
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
        let pathToProfilePic = undefined;
        if (req.files && req.files.profilePicture) {
          const profilePicture = req.files.profilePicture;
          const path = "public/profile_pic/" + username + '.' + req.files.profilePicture.name.split('.').pop();
          await profilePicture.mv(path);
          pathToProfilePic = path;
        }
        const userToCreate = {
          username: username,
          password: password,
          picture: pathToProfilePic
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

  app.use("/", middleware.requireLoginMiddleware);
  app.get("/", async function (req, res) {
    const postsBySubscription = await posts.getPostsBySubscriptions(req.currentUser.subscriptions);
    if (!req.currentUser.picture) {
      req.currentUser.picture = "public/default_profile_pic.png";
    }
    res.render("home", {
      user: req.currentUser,
      posts: postsBySubscription
    });
  });

  app.use("/messages/:username", middleware.requireLoginMiddleware);
  app.get("/messages/:username", async (req, res) => {
    const messages = await messages.getMessagesConcerningUsers(req.currentUser, req.params.username);
    const otherUser = await users.getUser(req.params.username);
    res.render("messages", {
      user: currentUser,
      other_user: otherUser,
      messages: messages
    });
  });

  app.use("/users/:username", middleware.requireLoginMiddleware);
  app.get("/users/:username", async (req, res) => {
    try {
      const user = await users.getUser(req.params.username);
      if (user) {
        const isCurrentUser = user.username === req.currentUser.username;
        res.render("profile", {
          user: user,
          isCurrentUser: isCurrentUser,
        });
      } else {
        res.render("profile", {
          missingUser: req.params.username
        });
      }
    } catch (e) {
      res.render("profile", {
        missingUser: req.params.username
      });
    }
  });

}
