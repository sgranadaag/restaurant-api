const jwt = require("jsonwebtoken");
const sha256 = require("sha256");
const User = require("../models/user.model");
const ExpireToken = require("../models/expireToken.model");
const { getToken } = require("../utils/getToken.util");

exports.login = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(422)
      .send({ error: "The user and password can't be empty" });

  const [savedUser] = await User.find({ user });

  if (!savedUser)
    return res.status(422).send({ error: "The user is not register" });

  if (savedUser.password !== sha256(password))
    return res.status(401).send({ error: "Wrong credentials" });

  const token = jwt.sign({ check: true }, process.env["API_TOKEN"], {
    expiresIn: "7d",
  });
  return res.status(200).send(token);
};

exports.logout = async (req, res) => {
  const token = getToken(req, res);
  if (!token) return res.status(400).send({ error: "The token cant be empty" });
  const expireToken = new ExpireToken({
    token,
  });
  try {
    await expireToken.save();
    return res.status(200).send({ message: "Success logout" });
  } catch (error) {
    res.status(500).send({
      error:
        error.message || "Something wrong occurred while creating the record.",
    });
  }
};

exports.create = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(422)
      .send({ error: "The user and password can't be empty" });

  const [userExist] = await User.find({ user });
  if (userExist)
    return res.status(422).send({ error: "The user is already registered" });

  const createdUser = new User({
    user,
    password: sha256(password),
  });

  try {
    await createdUser.save();
    const token = jwt.sign({ check: true }, process.env["API_TOKEN"], {
      expiresIn: "7d",
    });

    res.status(200).send({
      message: "The user has been created successfully",
      token,
    });
  } catch (error) {
    res.status(500).send({
      error:
        error.message || "Something wrong occurred while creating the record.",
    });
  }
};

exports.jwt = jwt;
