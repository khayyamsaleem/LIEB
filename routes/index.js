const configurePageRoutes = require("./pages.js");
const configureApiRoutes = require("./api.js");

module.exports = app => {
  configurePageRoutes(app);
  configureApiRoutes(app);
}
