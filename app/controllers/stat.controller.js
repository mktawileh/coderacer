const Stat = require("../models/stat");

exports.getRecentStatOfUser = async (userId, d = 2, no_id = true) => {
  let date;
  const year = new Date().getFullYear().toString();
  const month = (new Date().getMonth() + 1).toString();
  d = parseInt(d);
  switch (d) {
    case 0:
      date = new Date(0);
      break;
    case 1:
      date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
      break;
    case 2:
      date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
      break;
    case 3:
      date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      break;
    case 4:
      date = new Date(Date.now() - 1000 * 60 * 60 * 24);
      break;
    case 5:
      date = new Date(Date.now() - 1000 * 60 * 60 * 12);
      break;
    case 6:
      date = new Date(Date.now() - 1000 * 60 * 60 * 6);
      break;
    default:
      date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  }

  let result = await Stat.aggregate([
    {
      $match: {
        owner: userId,
        created_at: {
          $gt: date,
        },
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
    {
      $project: {
        y: "$avglst_speed",
        x: "$created_at",
        _id: !no_id,
      },
    },
  ]);
  return result;
};
