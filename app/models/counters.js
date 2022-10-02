const mongoose = require("mongoose");

const codeSchema = {
  sequence: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 1,
  },
};

const Counters = mongoose.model("counters", codeSchema);
async function getNextSeqValue(name) {
  console.log(name);
  const seqDoc = await Counters.findOneAndUpdate(
    {
      sequence: name,
    },

    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
    }
  );
  return seqDoc.value;
}

module.exports = { Counters, getNextSeqValue };
