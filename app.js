const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// Middle-ware for JSON in API
app.use(express.json());

// API "GET" Commands
app.get("/", (req, res) => {
  res.send("Hello from node API! updated");
});

// API "POST" Commands
app.post("/api/products", (req, res) => {
  res.send(req.body);
});

// Connects to Mongo DB using secure credentials
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
