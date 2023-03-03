const { authMiddleware } = require("../middleware/auth.middleware");
const { badRequestMiddleware } = require("../middleware/badRequest.middleware");

module.exports = (app) => {
  const users = require("../controllers/user.controller");
  app.post("/login", [badRequestMiddleware], users.login);
  app.get("/logout", [authMiddleware], users.logout);
  app.post("/register", [badRequestMiddleware], users.create);
};
