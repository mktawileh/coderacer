const router = require("express").Router();

const User = require("../models/user");
const Race = require("../models/race");
const Stat = require("../models/stat");

const authMiddleware = require("../middlewares/auth");
const guestOnlyMiddleware = require("../middlewares/guestOnly");
const ObjectId = require("mongoose").Types.ObjectId;

const { getRecentStatOfUser } = require("../controllers/stat.controller");

const nextDataPath = "/_next/data/:next_page_id";

function p(match) {
  return [nextDataPath + match, match];
}

function g(param) {
  if (param.indexOf(".json") > -1) {
    param = param.substr(0, param.indexOf(".json"));
  }
  return param;
}

// Protected Routes.
router.use(["/avatar/", "/profile/", "/race/with-friends"], authMiddleware);
// Guest Only
router.use(["/login", "/register"], guestOnlyMiddleware);

/*
  User Routes
*/
router.use(p("/user/:username"), async function (req, res, next) {
  const username = g(req.params.username);
  const { c = 100 } = req.query;

  req.pageProps = {};
  /* 0 => all, 1 => this year , 2 => this month, 3 => last week, 4 => last 24 hours */

  if (username) {
    const user = await User.aggregate([
      {
        $match: {
          username,
        },
      },
      {
        $project: {
          password: 0,
          _v: 0,
        },
      },
    ]);
    if (user[0]) {
      let result = await getRecentStatOfUser(user[0]._id);
      req.pageProps = JSON.stringify({
        user: user[0],
        avg_speed_stat: result,
      });
      next();
      return;
    }
  }
  const err = new Error("User Not found");
  err.status = 404;
  next(err);
});

/*
  Race Routes
*/
router.get(p("/race/analysis/:raceId"), async function (req, res, next) {
  const raceId = g(req.params.raceId);
  req.pageProps = {};
  if (raceId) {
    const race = await Race.aggregate([
      {
        $match: {
          _id: ObjectId(raceId),
        },
      },
      {
        $lookup: {
          from: "codes",
          localField: "code",
          foreignField: "_id",
          as: "code",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $project: {
          value: 1,
          acc: 1,
          beauty: 1,
          time: 1,
          cwpm: 1,
          spd: 1,
          mistakes: 1,
          score: 1,
          start_at: 1,
          code: {
            title: 1,
            value: 1,
            note: 1,
          },
          owner: {
            username: 1,
            fullName: 1,
            avatar: 1,
            lvl: 1,
            avglst_speed: 1,
            total_score: 1,
          },
        },
      },
    ]);

    if (race[0]) {
      race[0].owner = race[0].owner[0];
      race[0].code = race[0].code[0];
      req.pageProps = {
        data: JSON.stringify(race[0]),
      };
      next();
      return;
    }
  }

  const err = new Error("User Not found");
  err.status = 404;
  next(err);
});

module.exports = router;
