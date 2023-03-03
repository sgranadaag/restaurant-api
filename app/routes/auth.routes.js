const { authMiddleware } = require("../middleware/auth.middleware");
const { badRequestMiddleware } = require("../middleware/badRequest.middleware");

module.exports = (app) => {
  const users = require("../controllers/user.controller");
  app.post("/api/login", [badRequestMiddleware], users.login);
  app.get("/api/logout", [authMiddleware], users.logout);
  app.post("/api/register", [badRequestMiddleware], users.create);
};
