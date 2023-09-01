const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hitsSchema = new Schema(
  {
    userID: String,
    hits: {
      default: 0,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("apiHits", hitsSchema);
