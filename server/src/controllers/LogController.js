// server/src/controllers/LogController.js

const Log = require("../models/LogModel");

const searchLogs = async (filters) => {
  try {
    const logs = await Log.find(filters);
    return logs;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  searchLogs,
};
