var Track = require("../models/track");

exports.get = async function (req, res) {
  const user = req.user;
  try {
    await Track.deleteMany({ owner: user._id.toString() }).exec();
    const track = new Track({
      owner: user._id.toString(),
    });
    const result = await track.save();
    return res.status(200).send({
      status: true,
      message: "Successfull",

      id: result._id.toString(),
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "oOops something went wrong :(",
    });
  }
};

exports.check = async function (req, res) {
  const { id } = req.query;
  try {
    if (typeof id == "string" && id.length == 24) {
      const result = await Track.findById(id.substr(0, 24));
      if (result) {
        return res.send({
          status: true,
          owner: result.owner == req.user._id.toString(),
        });
      }
    }
    return res.send({ status: false });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: false,

      message: "oOops something went wrong :(",
    });
  }
};
