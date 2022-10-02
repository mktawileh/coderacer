var Code = require("../models/code");
var Race = require("../models/race");

const TIME_PRIVATE = 5; // Seconds
const TIME_PUBLIC = 10; // Seconds

exports.add = async function (req, res, next) {
  const { id, public = false, st = null } = req.body;
  if (!req.user && !req.guest) {
    const err = new Error("unauthorized");
    err.status = 403;
    return next(err);
  }
  if (id) {
    const code = await Code.findById(id);
    if (!code || code.deleted) {
      return res.status(200).send({
        status: false,
        message: "Code is not found",
      });
    }
    const start_at =
      st || Date.now() + (public ? TIME_PUBLIC : TIME_PRIVATE) * 1000;
    let race = {
      start_at,
    };
    if (req.user) {
      race = new Race({
        owner: req.user._id.toString(),
        code: id,
        start_at,
      });
      try {
        const result = await race.save();
        race = result;
      } catch (err) {
        return res.status(500).send({
          status: false,
          message: "oOops something went wrong :(",
        });
      }
    }
    return res.status(200).send({
      status: true,
      message: "Successfull",
      code,
      start_at: race.start_at,
      id: req.user ? race._id.toString() : null,
    });
  }
  return res.status(200).send({
    status: false,
    message: "the 'id' param Can't be empty :(",
  });
};

exports.del = async (req, res) => {
  const { id } = req.body;
  if (id) {
    try {
      const race = await Race.findById(id);
      if (race && !race.deleted) {
        race.deleted = true;
        await race.save();
        return res.send({
          status: true,
          message: "The race had been deleted :)",
        });
      } else {
        return res.send({
          status: false,
          message: "Sorry, there is no race in the database with that id :(",
        });
      }
    } catch (err) {
      return res.send({
        status: false,
        message: "Sorry, there is no race in the database with that id :(",
      });
    }
  } else {
    return res.send({
      status: false,
      message: "You need to include the id in the body request :)",
    });
  }
};

exports.get = async function (req, res) {
  const { id } = req.query;
  try {
    const race = await Race.findById(id).select(["-owner"]);
    if (race && !race.deleted) {
      return res.status(200).send({
        status: true,
        message: "Successfull",
        race,
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "Race is not found",
      });
    }
  } catch (err) {
    return res.status(200).send({
      status: false,
      message: "Race is not found",
    });
  }
};

exports.getWithCode = async function (req, res) {
  const { cid, id } = req.query;
  if (cid && id) {
    const code = await Code.findById(cid);
    if (!code || code.deleted) {
      return res.status(200).send({
        status: false,
        message: "Code is not found",
      });
    }
    const result = await Race.findById(id);

    return res.status(200).send({
      status: true,
      message: "Successfull",
      code,
      start_at: result.start_at,
      id: result._id.toString(),
    });

    // return res.status(500).send({
    //   status: false,
    //   message: "oOops something went wrong :(",
    // });
  }
  return res.status(200).send({
    status: false,
    message: "the 'id' param Can't be empty :(",
  });
};

exports.getRecentOfUser = async function (req, res) {
  const { c = 10 } = req.query;
  try {
    const races = await Race.aggregate([
      {
        $match: {
          owner: req.user._id,
          finished: true,
        },
      },
      {
        $sort: {
          start_at: -1,
        },
      },
      {
        $limit: parseInt(c),
      },
    ]);
    return res.send({
      status: true,
      message: "Successfull",
      races,
    });
  } catch (error) {
    return res.send({
      status: false,
      message: "OooPs SOmething went wrong :(",
    });
  }
};

exports.getLatest = async function (req, res) {
  const { page, sortBy = "updated_at" } = req.query;
  try {
    const cnt = await Code.countDocuments({ deleted: false });
    const pages = Math.ceil(cnt / 10);
    if (page <= pages && page >= 1) {
      const codes = await Code.find({ deleted: false })
        .sort(`-${sortBy}`)
        .skip((page - 1) * 10)
        .limit(10);
      return res.send({
        status: true,
        message: "Successfull",
        data: codes,
        pages,
      });
    } else {
      if (pages == 0) {
        return res.send({
          status: true,
          data: [],
          message: "You don't have any code yet :(",
        });
      }
      return res.send({ status: false, message: "Page not found! :(" });
    }
  } catch (err) {
    return res.send({ status: false, message: err });
  }
};

exports.getRandomCodes = async function (req, res) {
  const { number = 69 } = req.body;
  try {
    const codes = await Code.aggregate([{ $sample: { size: number } }]);

    return res.send({
      status: true,
      message: "Successfull",
      data: codes.map((e) => e._id),
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Some error occured in the server :(",
    });
  }
};

exports.getCodeScoreBoard = async function (req, res) {
  const { cid } = req.query;
  if (!cid)
    return res.send({ status: false, message: "Param 'cid' is missing!" });
  try {
    // .find({ code: cid, score: { $gt: 0 } })
    const scores = await Race.aggregate([
      {
        $match: {
          score: {
            $gt: 0,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          cwpm: 1,
          score: 1,
          start_at: 1,
          user: {
            username: 1,
            avatar: 1,
            lvl: 1,
          },
        },
      },
      {
        $sort: {
          score: -1,
          cwpm: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    // .sort({ score: -1 })
    // .limit(10);
    return res.send({ status: true, data: scores, message: "Successfull" });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "OoOps.. Something went wrong :(",
      err,
    });
  }
};

exports.getTopRacesLastWeek = async function (req, res) {
  const { by = "score" } = req.query;
  let field = "score";
  if (by == "speed") field = "cwpm";
  try {
    const races = await Race.aggregate([
      {
        $match: {
          created_at: {
            $gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
          finsihed: true,
        },
      },
      {
        $sort: {
          [field]: -1,
          created_at: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          [field]: 1,

          start_at: 1,
          user: {
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        },
      },
    ]);
    if (races) {
      res.send({ message: "Successfull", status: true, data: races });
    } else {
      throw new Error("no top races :(");
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "OoOps something went wrong :( ", status: false });
  }
};

exports.getRecent = async function (req, res) {
  const { c = 10 } = req.query;
  const li = parseInt(c);
  try {
    const races = await Race.aggregate([
      {
        $match: {
          score: {
            $gt: 0,
          },
          finished: true,
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $limit: li,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          start_at: 1,
          cwpm: 1,
          score: 1,
          beauty: 1,
          acc: 1,
          user: {
            username: 1,
            fullName: 1,
            avatar: 1,
            lvl: 1,
          },
        },
      },
    ]);
    if (races) {
      res.send({ message: "Successfull", status: true, data: races });
    } else {
      throw new Error("no top races :(");
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "OoOps something went wrong :( ", status: false, err });
  }
};
