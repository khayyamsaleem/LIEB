const users = require('../users');
const middleware = require('../middleware');

module.exports = app => {

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
      res.render("profile", {
        errors: errors
      })
    } else {
      try {
        if (req.files && req.files.profilePicture) {
          const profilePicture = req.files.profilePicture;
          const path = "public/profile_pic/" + username;
          await profilePicture.mv(path);
        }

        const updateSuccess = await users.updatePicture(req.currentUser.username, pathToProfilePic);
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
