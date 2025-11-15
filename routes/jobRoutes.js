const express = require("express");
const router = express.Router();
const Job = require("../models/jobs");

/**
 * ✅ Add a new job
 */
router.post("/add", async (req, res) => {
  try {
    const { title, description, location, city, contactNumber, latitude, longitude } = req.body;

    // Validation check
    if (!title || !description || !location || !contactNumber) {
      return res.status(400).json({ message: "Please fill all required fields!" });
    }

    // Always include city field (even if empty)
    const job = new Job({
      title,
      description,
      location,
      city: city || "", // ensure field exists
      contactNumber,
      latitude,
      longitude,
    });

    await job.save();
    res.status(201).json({ message: "✅ Job added successfully!", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Get all jobs (with optional filters)
 */
router.get("/all", async (req, res) => {
  try {
    const { keyword, location, city } = req.query;
    const filter = {};

    if (keyword && keyword.trim() !== "") {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location && location.trim() !== "") {
      filter.location = { $regex: location, $options: "i" };
    }

    if (city && city.trim() !== "") {
      filter.city = { $regex: city, $options: "i" };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Search jobs by keyword, location, or city
 */
router.get("/search", async (req, res) => {
  try {
    const { keyword = "", city = "", location = "" } = req.query;
    const filter = {};

    if (keyword.trim() !== "") {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location.trim() !== "") {
      filter.location = { $regex: location, $options: "i" };
    }

    if (city.trim() !== "") {
      filter.city = { $regex: city, $options: "i" };
    }

    const jobs = await Job.find(filter);
    if (jobs.length === 0) {
      return res.status(200).json({ message: "No jobs found" });
    }

    res.json(jobs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
