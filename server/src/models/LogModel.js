// server/src/models/LogModel.js

const mongoose = require("mongoose");

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

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
