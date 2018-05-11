const users = require('./users');

const setUserMiddleware = async (req, res, next) => {
  req.currentUser = await users.getUserBySessionId(req.cookies.AuthCookie);
  next();
};

const requireLoginMiddleware = (req, res, next) => {
  if (req.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

const requireLoginApiMiddleware = (req, res, next) => {
  if (req.currentUser) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const requireNoLoginMiddleware = (req, res, next) => {
  if (req.currentUser) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  setUserMiddleware,
  requireLoginMiddleware,
  requireLoginApiMiddleware,
  requireNoLoginMiddleware
}
