const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema(
  {
    logID: String,
    log: String,
    logData: {
      default: {},
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("logs", logSchema);
