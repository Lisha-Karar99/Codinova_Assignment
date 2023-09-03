const jwt = require("jsonwebtoken");
const User = require("../model/userModel.js");
const { userTypes } = require("./userTypeConstants.js");

module.exports.authenticatedAdmin = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new Error("There is no authorization token");
    }
    // get token from header
    let token = req.headers["authorization"].split(" ")[1];

    let verfiedToken = jwt.verify(token, process.env.ACCESS_SEKRET_KEY);

    // if token verfied
    if (verfiedToken.data.type === userTypes.ADMIN) {
      let user = await User.findById(verfiedToken.data.id);
      if (user) {
        req.user = verfiedToken.data;
        next();
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("You are not authenticated user");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: err.name
      })
    }
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.authenticatedManager = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new Error("There is no authorization token");
    }
    // get token from header
    let token = req.headers["authorization"].split(" ")[1];

    let verfiedToken = jwt.verify(token, process.env.ACCESS_SEKRET_KEY);

    // if token verfied
    if (verfiedToken.data.type === userTypes.MANAGER) {
      let user = await User.findById(verfiedToken.data.id);
      if (user) {
        req.user = verfiedToken.data;
        next();
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("You are not authenticated user");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: err.name
        })
    }
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.authenticatedBoth = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new Error("There is no authorization token");
    }
    // get token from header
    let token = req.headers["authorization"].split(" ")[1];

    let verfiedToken = jwt.verify(token, process.env.ACCESS_SEKRET_KEY);

    // if token verfied
    if (
      verfiedToken.data.type === userTypes.ADMIN ||
      verfiedToken.data.type === userTypes.MANAGER
    ) {
      let user = await User.findById(verfiedToken.data.id);
      if (user) {
        req.user = verfiedToken.data;
        next();
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("You are not authenticated user");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: err.name
        })
    }
    return res.status(400).json({
      message: err.message,
    });
  }
};
