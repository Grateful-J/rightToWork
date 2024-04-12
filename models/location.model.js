const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  fullAddress: String,
  street: String,
  city: { String, required: true },
  state: { String, required: true },
  zip: String,
  country: String,
});

module.exports = mongoose.model("Location", locationSchema);
