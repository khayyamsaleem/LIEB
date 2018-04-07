module.exports = app => {

  app.get("/login", (req, res) => {
    // TODO: Provide login page
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    // TODO: Provide signup page
    res.render("signup");
  });

  app.get("/", function (req, res) {
    // TODO: Provide the homepage, show posts
    res.render("home");
  });

  app.get("/messages/:username", function (req, res) {
    // TODO: Provide messages between the currently logged in user,
    // and the user in the params.
    res.render("messages");
  });

  app.get("/users/:username", function (req, res) {
    // TODO: Respond with the user's profile iff it exists
    res.render("profile");
  });

}
