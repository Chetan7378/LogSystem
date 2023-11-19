// server/src/routes/logRoutes.js
const { Log } = require("../models/LogModel");
const express = require("express");
const { searchLogs } = require("../controllers/LogController");

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const filters = req.body;
    const logs = await searchLogs(filters);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/query", async (req, res) => {
  try {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
    } = req.body;

    console.log("Received search parameters:", {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
    });

    // Check if at least one search parameter is provided
    if (
      !(
        level ||
        message ||
        resourceId ||
        timestamp ||
        traceId ||
        spanId ||
        commit ||
        parentResourceId
      )
    ) {
      return res
        .status(400)
        .json({ error: "At least one search parameter is required." });
    }

    // Build the query based on provided parameters
    const query = {};
    if (level) query.level = { $eq: level };
    if (message) query.message = { $regex: message, $options: "i" };
    if (resourceId) query.resourceId = { $eq: resourceId };
    if (timestamp) query.timestamp = { $eq: timestamp };
    if (traceId) query.traceId = { $eq: traceId };
    if (spanId) query.spanId = { $eq: spanId };
    if (commit) query.commit = { $eq: commit };
    if (parentResourceId)
      query["metadata.parentResourceId"] = { $eq: parentResourceId };

    console.log("Generated MongoDB query:", query);

    const searchResults = await Log.find(query);
    console.log("Search results:", searchResults);

    res.json(searchResults);
  } catch (error) {
    console.error("Error querying logs:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
