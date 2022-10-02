const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Code",
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Track",
  },
  value: "",
  acc: {
    type: Object,
    default: {},
  },
  mistakes: {
    type: Object,
    default: {},
  },
  time: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  cwpm: {
    type: Number,
    default: 0,
  },
  beauty: {
    type: Number,
    default: 0,
  },
  place: {
    type: Number,
    default: 0,
  },

  spd: [],
  finished: false,
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: false,
  public: {
    type: Boolean,
    default: true,
  },
  start_at: {
    type: Date,
    default: "",
  },
});

module.exports = mongoose.model("Race", raceSchema);
