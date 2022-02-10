const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs"); //file system
// Accessing the path module
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //for the .env file hiddle values
}

const app = express();
const dbUrl = process.env.DATABASE || "mongodb://localhost:27017/ecommerce";

mongoose
  .connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => {
    console.log("DB CONNECTION ERROR", err);
  });

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

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}.`));

module.exports = app;
