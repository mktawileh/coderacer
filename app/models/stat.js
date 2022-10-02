const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = mongoose.Types;

const statSchema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
  race_id: {
    type: Types.ObjectId,
    ref: "Race",
  },
  hst_speed: {
    type: Number,
    default: 0,
  },
  hst_score: {
    type: Number,
    default: 0,
  },
  avg_speed: {
    type: Number,
    default: 0,
  },
  avg_score: {
    type: Number,
    default: 0,
  },
  avglst_speed: {
    type: Number,
    default: 0,
  },
  avglst_score: {
    type: Number,
    default: 0,
  },
  total_score: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: false,
  public: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Stat", statSchema);
