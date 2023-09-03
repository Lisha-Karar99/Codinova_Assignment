const Express = require("express");
const Router = Express.Router();

Router.get("/check", (req, res) => {
  res.send("OK");
});

Router.use("/user", require("./user/index"));
Router.use("/product", require("./product/index"));
Router.use("/sales", require("./sales/index"));

module.exports = Router;
