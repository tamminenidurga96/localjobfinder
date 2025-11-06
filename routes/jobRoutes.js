const express = require("express");
const router = express.Router();
const Job = require("../models/jobs");

// ✅ Add a new job
router.post("/add", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "Job added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all jobs
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Search jobs by keyword (title, description, or location)
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    if (!keyword.trim()) {
      const jobs = await Job.find();
      return res.json(jobs);
    }

    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(jobs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
