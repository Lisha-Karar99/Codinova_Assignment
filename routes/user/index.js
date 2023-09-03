const userController = require("../../controllers/userCotroller");

const express = require("express");
const Router = express.Router();

Router.post("/signup", userController.signup);
Router.post("/login", userController.login);
Router.post("/refresh_token", userController.newToken);

module.exports = Router;
