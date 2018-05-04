const users = require('./users');

module.exports = async (req, res, next) => {
  req.currentUser = await users.getUserBySessionId(req.cookies.AuthCookie);
  next();
};
