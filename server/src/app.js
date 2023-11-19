// server/src/app.js

const express = require("express");
const mongoose = require("mongoose");
const logRoutes = require("./routes/logRoutes");
const cors = require("cors"); // Import cors module
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use cors middleware
app.use(cors());
//enter your databse link
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String,
  },
});

const Log1 = mongoose.model("Log1", logSchema);

app.post("/ingest", async (req, res) => {
  try {
    const logData = req.body;
    const log = new Log1(logData);
    await log.save();
    console.log("Received and saved log:", logData);
    res.send("Log ingested successfully");
  } catch (error) {
    console.error("Error ingesting log:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.use("/logs", logRoutes);

// Remove the second app.listen() call
// app.listen(PORT, (error) => {
//   if (error) console.error("❌ Unable to connect the server: ", error);
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
