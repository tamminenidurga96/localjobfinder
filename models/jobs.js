const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }, // District or area
  city: { type: String, required: true }, // City or town (required true ✅)
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  contactNumber: { type: String, required: true },
});

module.exports = mongoose.model("Job", jobSchema);
