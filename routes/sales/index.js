const salesController = require("../../controllers/salesController");
const userAuth = require("../../middlewares/isAuthenticate.js");
const express = require("express");
const Router = express.Router();

Router.post(
  "/storeProduct",
  userAuth.authenticatedBoth,
  salesController.storeSalesDetails
);

module.exports = Router;
