//this is used with supertest
const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs"); //file system
// Accessing the path module
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //for the .env file hiddle values
}

const app = express();

app.use(morgan("dev")); //provides request information in the server terminal
app.use(express.json({ limit: "50mb" })); //parse incoming as a JSON Object
app.use(cors());

app.use(express.static(path.resolve(__dirname, "./client/build")));

//require, prefix, and use any/all routes in the routes dir
fs.readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

app.use("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

module.exports = app;
