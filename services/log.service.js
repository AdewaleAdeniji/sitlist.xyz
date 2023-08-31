const Logs = require("../models/Logs");
const { generateID } = require("../utils");
const { config } = require("../utils/configs");

exports.Log = async (log, logData = {}) => {
  const logObject = { log, logData };
  logObject.logID = generateID();
  await Logs.create(logObject);
};
exports.getLogs = async (logKey) => {
  if (logKey === config.LOG_KEY) {
    const logs = await Logs.find({});
    return logs;
  }
  return [];
};
