const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require('./models/product.model');
const Job = require('./models/jobs.model');
require("dotenv").config();

// Middle-ware for JSON in API
app.use(express.json());

// Example: Creating a new job
const newJob = new Job({
    jobName: "Example Job",
    client: "Example Client",
    location: "Arizona",
    startDate: new Date(),
    endDate: new Date(),
    travelDays: 2,
  });
  
  newJob.save()
    .then(savedJob => console.log(savedJob))
    .catch(err => console.error(err));

// API "GET" Commands
app.get("/", (req, res) => {
  res.send("Hello from node API! updated");
});

// API "GET" Products
app.get("/api/products", async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products)

    } catch(error) {
        res.status(500).json({message: error.message});

    }
});

// API "POST" Commands
app.post("/api/products",async (req, res) => {
  try {
    const product = await Product.create(req.body) // creates new product from response
    res.status(200).json({product});

  } catch (error) {
    res.status(500).json({message: error.message});
  }
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
