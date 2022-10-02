const mongoose = require("mongoose");
const { getNextSeqValue } = require("./counters");

const Schema = mongoose.Schema;
const randomCodesSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  codes_ids: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RandomCodes", randomCodesSchema);
