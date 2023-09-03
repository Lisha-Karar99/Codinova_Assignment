// configure dotenv file
require("dotenv").config();

// import modules
const express = require("express");
const db = require("./config/db.js");

// port number at which server is running
const port = process.env.PORT;
// express app
const app = express();

// connecting database
db();

// middleware to handle json object
app.use(express.json());
// middleware to handle url encoded form data object
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// ENDPOINT
app.use("/api", require("./routes/index.js"));

app.use((req, res, next) => {
  const error = new Error("This is not a valid endpoint");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status).json({ error: err.message || "Something went wrong!" });
});

// server listening
const server = app.listen(port, (err) => {
  if (err) {
    console.log(`Error in server listening :-${err}`);
    return;
  }
  console.log(`Server listening at http://localhost:${port}`);
});
