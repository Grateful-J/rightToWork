const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

const geoURL = "";
const geoKey = process.env.GEOAPIFY_AUTO_COMPLETE_KEY;

//Endpoint for location autocomplete
router.get("/autocomplete", async (req, res) => {
  const searchText = req.query.text; // Get the search text from the request
});
