const express = require("express");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("Server is running, yo! on port 3000");
    });
  })

  .catch(() => {
    console.log("Error: Connecting to Database");
  });

app.get("/", (req, res) => {
  res.send("Hello from node API! updated x3");
});
