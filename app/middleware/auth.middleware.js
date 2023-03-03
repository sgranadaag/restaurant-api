const { jwt } = require("../controllers/user.controller");
const ExpireToken = require("../models/expireToken.model");
const { getToken } = require("../utils/getToken.util");

exports.authMiddleware = async (req, res, next) => {
  const token = getToken(req, res);
  if (!token) return res.status(400).send({ error: "The token cant be emty" });
  try {
    const [isExpireToken] = await ExpireToken.find({ token });
    if (isExpireToken)
      return res.status(401).send({ error: "Your token has been expired" });

    jwt.verify(token, process.env["API_TOKEN"], (error, decoded) => {
      if (error) return res.status(401).send({ error: "Unauthorized" });
      else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
