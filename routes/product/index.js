const productController = require("../../controllers/productController");
const userAuth = require("../../middlewares/isAuthenticate.js");
const express = require("express");
const Router = express.Router();

Router.post(
  "/storeProduct",
  userAuth.authenticatedAdmin,
  productController.storeProduct
);
Router.patch(
  "/updateProduct/:id",
  userAuth.authenticatedAdmin,
  productController.updateProduct
);
Router.delete(
  "/deleteProduct/:id",
  userAuth.authenticatedAdmin,
  productController.deleteProduct
);
Router.get(
  "/getCategory",
  userAuth.authenticatedBoth,
  productController.getAllCategory
);
Router.get(
  "/getProduct/:category",
  userAuth.authenticatedBoth,
  productController.getProductByCategory
);
Router.get(
  "/getProductByName/:name",
  userAuth.authenticatedBoth,
  productController.getProductByName
);

module.exports = Router;
