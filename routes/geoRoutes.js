const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

const geoURL = "";
const geoKey = process.env.GEOAPIFY_AUTO_COMPLETE_KEY;

//Endpoint for location autocomplete
router.get("/autocomplete", async (req, res) => {
  const searchText = req.query.text; // Get the search text from the request

  //Safeguard: ensure is not empty
  if (!searchText) {
    return res.status(400).json({ error: "Search text cannot be empty" });
  }

  //search text constructor
  const requestURL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    searchText
  )}&type=auto&lang=en&format=json&apiKey=${geoKey}`;

  try {
    const response = await fetch(requestURL);
    const data = await response.json();
    res.status(200).json(data);

    //return the API response back to client
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Export router
module.exports = router;
