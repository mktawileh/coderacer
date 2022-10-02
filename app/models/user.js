const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = mongoose.Types;
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "fullname not provided "],
  },
  username: {
    type: String,
    required: [true, "username not provided "],
    unique: true,
  },
  personal_track: {
    type: Types.ObjectId,
    ref: "Track",
  },
  password: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  hst_speed: {
    type: Number,
    default: 0,
  },
  avg_speed: {
    type: Number,
    default: 0,
  },
  avglst_speed: {
    type: Number,
    default: 0,
  },

  hst_score: {
    type: Number,
    default: 0,
  },
  avg_score: {
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

  teaLove: {
    type: Number,
    default: 0,
  },
  coffeeLove: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: "a",
  },
  lvl: {
    type: Number,
    default: 0,
  },
  best_lvl: {
    type: Number,
    default: 0,
  },
  hst_avglst_speed: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "member",
  },
});

module.exports = mongoose.model("User", userSchema);
