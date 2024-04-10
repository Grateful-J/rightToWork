const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const jobRoutes = require("./routes/jobRoutes"); // Adjusted for a models directory

// Express app
const app = express();

//Enable CORS
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Middle-ware for JSON in API
app.use(express.json());

// API "GET" Address from GEO
const geoURL = "https://api.geoapify.com/v1/geocode/autocomplete?REQUEST_PARAMS";
const geoKey = process.env.GEOAPIFY_AUTO_COMPLETE_KEY;

//Example URL:https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=geoKey

const requestGeoOptions = {
  method: "GET",
};

fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=Flor&apiKey=${geoKey}`, requestGeoOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

// API "GET" Commands
app.get("/", (req, res) => {
  res.send("Hello from node API! updated");
});

//Use Routes
app.use("/api/jobs", jobRoutes);

// Serve static assets if in production
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Connects to Mongo DB using secure credentials
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })

  .catch(() => {
    console.log("Error: Connecting to Database");
  });
