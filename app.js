const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const Job = require("./models/jobs.model");
require("dotenv").config();

// Middle-ware for JSON in API
app.use(express.json());

// API "GET" Commands
app.get("/", (req, res) => {
  res.send("Hello from node API! updated");
});

// GET all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new job
app.post("/api/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    const newJob = await job.save(); // Saves new job
    res.status(201).json(newJob); //Return the saved job, status 201 for created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Updates new job
app.patch("api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
