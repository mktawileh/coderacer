const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  finished: false,
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: false,
});

module.exports = mongoose.model("Track", trackSchema);
