const mongoose = require("mongoose");
const { getNextSeqValue } = require("./counters");

const Schema = mongoose.Schema;
const codeSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    default: "",
  },
  value: { type: String, defualt: "" },
  words: [],
  note: "",
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    defualt: Date.now + 1,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

codeSchema.pre("save", async function (next) {
  let doc = this;
  if (!doc.title) {
    const counter = await getNextSeqValue("code");
    doc.title = `Code #${counter}`;
    next();
  }
});
module.exports = mongoose.model("Code", codeSchema);
