const posts = require('../posts');

const users = require('../users');
const middleware = require('../middleware');
const messages = require('../messages');

module.exports = app => {

  // Posts
  app.use("/posts", middleware.requireLoginApiMiddleware);
  app.post("/posts", async (req, res) => {
    const p = {
        poster: req.currentUser.username,
        content: req.body.content,
        attachments: []
    }
    if (req.files && req.files.attachment) {
      const att = req.files.attachment;
      const path = "public/post_attachment/" + req.currentUser.username + '.' + att.name.split('.').pop();
      await att.mv(path);
      p.attachments.push(path);
    }
    const chk = await posts.createPost(p)
    if (chk) {
      res.redirect('/');
    } else {
      res.status(500).json({err: "unable to add post to database"});
    }
  });

  app.use("/posts/:postId", middleware.requireLoginApiMiddleware);
  app.put("/posts/:postId", async (req, res) => {
    const p_id = req.params.postId;
    const new_content = req.body.content;
    const updated = await posts.updatePost(p_id, new_content);
    if (updated) res.status(200).end()
    else res.status(500).json({err: "unable to update post"})
  });

  app.use("/posts/:postId/react", middleware.requireLoginApiMiddleware);
  app.post("/posts/:postId/react", async (req, res) => {
    const p_id = req.params.postId;
    const r = req.body.reaction;
    const u = req.currentUser.username;
    const chk = await posts.addReactionToPost(p_id, u, r);
    if (chk) res.status(200).end();
    else res.status(500).json({err: "unable to add reaction to post"});
  });

  app.use("/posts/:postId/removeReact", middleware.requireLoginApiMiddleware);
  app.post("/posts/:postId/removeReact", async (req, res) => {
    const p_id = req.params.postId;
    const r = req.body.reaction;
    const u = req.currentUser.username;
    const chk = await posts.removeReactionFromPost(p_id, u, r);
    if (chk) res.status(200).end()
    else res.status(500).json({err: "unable to remove reaction from post"});
  });

  app.use("/posts", middleware.requireLoginApiMiddleware);
  app.get("/posts/:postId", async (req, res) => {
    const user = req.currentUser;
    const post = await posts.getPostById(req.params.postId);

    if (post.poster === user.username) {
        // Perform the deletion
        const good = await posts.deletePost(post._id);
        if (good) res.redirect("/users/" + user.username);
        else res.status(500).json({err: "unable to delete post"});
    } else res.status(500).json({err: "deletion is not authorized"});
  });

  app.get("/users/:username/sub", async (req, res) => {
    const user = req.currentUser;

    try {
      await users.addSubscription(user.username, req.params.username);
      res.redirect('/users/' + req.params.username);
    } catch (e) {
      res.redirect('/users/' + req.params.username);
    }
  });

  app.get("/users/:username/unsub", async (req, res) => {
    const user = req.currentUser;

    try {
      await users.removeSubscription(user.username, req.params.username);
      res.redirect('/users/' + req.params.username);
    } catch (e) {
      res.redirect('/users/' + req.params.username);
    }
  });

  app.post("/create_message/:toUser", async (req, res) => {
    const msg = req.body.content;
    const u_id = req.currentUser.username;
    const o_id = req.params.toUser;
    const mshg = await messages.createMessage(msg, u_id, o_id);
    res.redirect("/messages/" + req.params.toUser);
  })

  app.use("/updateEmail", middleware.requireLoginApiMiddleware);
  app.post("/updateEmail", async (req, res) => {
    const newEmail = req.body.newEmail;

    const errors = [];

    if (newEmail === undefined || newEmail === "") {
      errors.push('Email must be provided');
    }

    if (errors.length > 0) {
      res.status(500).json({
        errors: errors
      })
    } else {
      try {
        const updateSuccess = await users.updateUserProfile(req.currentUser.username, { email: newEmail });
        if (updateSuccess) {
          res.status(200).json({
            message: "Email updated."
          });
        } else {
          res.status(500).json({
            errors: ['Failed to update user email.']
          });
        }
      } catch (e) {
        res.status(500).json({
          errors: [`Failed to update user email, error: ${e}`]
        });
      }
    }
  });

  app.use("/updateDesc", middleware.requireLoginApiMiddleware);
  app.post("/updateDesc", async (req, res) => {
    const newDesc = req.body.newDesc;

    const errors = [];

    if (newDesc === undefined || newDesc === "") {
      errors.push('Description must be provided');
    }

    if (errors.length > 0) {
      res.status(500).json({
        errors: errors
      })
    } else {
      try {
        const updateSuccess = await users.updateUserProfile(req.currentUser.username, { desc: newDesc });
        if (updateSuccess) {
          res.status(200).json({
            message: "Description updated."
          });
        } else {
          res.status(500).json({
            errors: ['Failed to update user description.']
          });
        }
      } catch (e) {
        res.status(500).json({
          errors: [`Failed to update user description, error: ${e}`]
        });
      }
    }
  });

  app.use("/updatePassword", middleware.requireLoginApiMiddleware);
  app.post("/updatePassword", async (req, res) => {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const newPasswordAgain = req.body.newPasswordAgain;

    const errors = [];

    if (newPassword === undefined || newPassword === "") {
      errors.push('Password must be provided');
    }

    if (newPasswordAgain === undefined || newPasswordAgain === "") {
      errors.push('Password confirmation must be provided');
    }

    if (newPassword && newPasswordAgain && newPassword !== "" && newPasswordAgain !== ""
      && newPassword !== newPasswordAgain) {
      errors.push('Password must match password confirmation');
    }

    const validPassword = await users.checkPassword(req.currentUser.username, currentPassword);

    if (!validPassword) {
      errors.push('Provided current password not correct');
    }

    if (errors.length > 0) {
      res.status(500).json({
        errors: errors
      })
    } else {
      try {
        const updateSuccess = await users.updatePassword(req.currentUser.username, newPassword);
        if (updateSuccess) {
          res.status(200).json({
            message: "Password updated."
          });
        } else {
          res.status(500).json({
            errors: ['Failed to update user password.']
          });
        }
      } catch (e) {
        res.status(500).json({
          errors: [`Failed to update user password, error: ${e}`]
        });
      }
    }
  });

  app.use("/updatePicture", middleware.requireLoginApiMiddleware);
  app.post("/updatePicture", async (req, res) => {
    const errors = [];

    if (!req.files || !req.files.profilePicture) {
      errors.push("Must provide new profile picture.");
    }

    if (errors.length > 0) {
      res.status(500).json({
        errors: errors
      })
    } else {
      try {
        let path = undefined;
        if (req.files && req.files.profilePicture) {
          const profilePicture = req.files.profilePicture;
          path = "public/profile_pic/" + req.currentUser.username + '.' + req.files.profilePicture.name.split('.').pop();
          await profilePicture.mv(path);
        }

        const updateSuccess = await users.updatePicture(req.currentUser.username, path);
        if (updateSuccess) {
          res.status(200).json({
            message: "Profile picture updated."
          });
        } else {
          res.status(500).json({
            errors: ['Failed to update profile picture.']
          });
        }
      } catch (e) {
        res.status(500).json({
          errors: [`Failed to update profile picture, error: ${e}`]
        });
      }
    }
  });

}
