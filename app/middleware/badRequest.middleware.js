exports.badRequestMiddleware = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      error: "The data can not be empty",
    });
  }
  next();
};
