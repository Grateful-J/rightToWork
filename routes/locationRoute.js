const express = require("express");
const router = express.Router();
const Location = require("../models/location.model");

//GET all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find({});
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST new location
router.post("/", async (req, res) => {
  const newLocation = new Location(req.body);
  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//PATCH location
router.patch("/:id", async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//PUT location
router.put("/:id", async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//DELETE location
router.delete("/:id", async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
