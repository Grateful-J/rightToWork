const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const Job = require("./models/jobs.model");
require("dotenv").config();
const cors = require('cors');
app.use(cors());




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
app.patch("/api/jobs/:id", async (req, res) => {
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

// DELETEs Jobs
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve static files from React client app
app.use(express.static(path.join(__dirname, 'client/build')));

//Catch All handler, if doesnt match above, send back to Reach index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'))
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

//Connects to front end
function onSave(job) {
    fetch('/api/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally: Refresh the job list to show the new job
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Connects to Mongo DB using secure credentials
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })

  .catch(() => {
    console.log("Error: Connecting to Database");
  });
