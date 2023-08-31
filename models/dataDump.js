const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    dumpID: String,
    waitlistID: String,
    waitlistData: {
        type: Object,
        default: {},
    },
    waitlistDataKey: {
        default: "",
        type: String,
    },
    status: {
      default: true,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
exports.waitlistData = dataSchema;
module.exports = mongoose.model("waitlistData", dataSchema);
