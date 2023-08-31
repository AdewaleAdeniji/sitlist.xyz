const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waitlistSchema = new Schema(
  {
    waitlistID: String,
    userID: String,
    waitlistTitle: String,
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
