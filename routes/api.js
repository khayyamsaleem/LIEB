const posts = require('../posts');

const users = require('../users');
const middleware = require('../middleware');

module.exports = app => {
  // Posts
  app.use("/posts", middleware.requireLoginApiMiddleware);
  app.post("/posts", async (req, res) => {
    const p = {
        poster: req.currentUser.username,
        content: req.body.content,
        attachments: []
    }
    let path = undefined;
    if (req.files && req.files.attachment){
      const att = req.files.attachment;
      p.attachments.push(att);
      path = "public/post_attachment/" + req.currentUser.username + '.' + req.files.attachment.name.split('.').pop();
      await att.mv(path);
    }
    const chk = await posts.createPost(p)
    if (chk) {
      res.redirect('/');
      // res.status(200).end()
    } else {
      res.status(500).json({err: "unable to add post to database"});
    }
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
    const u = req.currentUser.username;
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

  app.get("/posts/:postId", async (req, res) => {
    console.log("Deleting post", req.params.postId);

    const user = req.currentUser;
    const post = await posts.getPostById(req.params.postId);
    
    if (post.poster === user.username) {
        // Perform the deletion
        const good = await posts.deletePost(post._id);
        if (good) res.redirect("/users/" + user.username);
        else res.status(500).json({err: "unable to delete post"});
    } else res.status(500).json({err: "deletion is not authorized"});
  });

  // Messages
  app.post("/messages/:toUser", (req, res) => {
    // TODO: create a new message from the currently logged in
    // user to the user in the url

  });

  app.use("/updatePassword", middleware.requireLoginApiMiddleware);
  app.post("/updatePassword", async (req, res) => {
    console.log(JSON.stringify(req.body));
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

    console.log(JSON.stringify(req.currentUser));
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
          console.log("success");
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
