const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waitlistSchema = new Schema(
  {
    waitlistID: {
      type: String,
      immutable: true,
      unique: true,
    },
    userID: {
      type: String,
      immutable: true,
    },
    filled: {
      type: Number,
      default: 0,
    },
    waitlistTitle: {
      type: String,
      default: 'N/A',
    },
    settings: {
      default: {
        restrictDomain: false,
        allowedDomain: "*",
        sendEmailToOwner: false,
        sendEmailToUser: false,
      },
      type: Object,
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
exports.waitlists = waitlistSchema;
module.exports = mongoose.model("waitlists", waitlistSchema);
