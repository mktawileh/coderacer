const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.updateInfo = async function (req, res) {
  const { username, fullName, avatar, teaLove, coffeeLove, email } = req.body;

  const user = await User.findOne({ username: req.user.username });
  var errs = new Array();

  if (username) {
    if (username.length >= 5 && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(username)) {
      user.username = username;
    } else {
      if (username.length < 5)
        errs.push(`The username "${username}}" is not valid.`);
      else
        errs.push(
          "Your username must look like a declaration of a variable name 😎"
        );
    }
  }

  if (fullName) {
    if (fullName.length >= 5) {
      user.fullName = fullName;
    } else {
      errs.push(`The name you entered is not valid`);
    }
  }

  //   if (
  //     avatar.charCodeAt() >= "a".charCodeAt() &&
  //     avatar.charCodeAt() <= "t".charCodeAt()
  //   ) {
  //     user.avatar = avatar;
  //   } else {
  //     errs.push("Avatar is not valid");
  //   }

  if (teaLove) {
    if (teaLove <= 100 && teaLove >= 0) {
      user.teaLove = teaLove;
    } else {
      errs.push("Your love of tea must be between 0 and 100");
    }
  }

  if (coffeeLove) {
    if (coffeeLove <= 100 && coffeeLove >= 0) {
      user.coffeeLove = coffeeLove;
    } else {
      errs.push("Your love to coffee must be between 0 and 100");
    }
  }
  if (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      user.email = email;
    } else {
      errs.push("The email you entered is not valid");
    }
  }

  user
    .save()
    .then((updatedUser) => {
      return res.status(200).send({
        status: true,
        message: "Changes had been saved successfully :)",
        errors: errs,
        user: updatedUser,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: false,
        message: "An error has been occured",
      });
    });
};

exports.setAvatar = async (req, res) => {
  if (req.user) {
    const doc = await User.findByIdAndUpdate(req.user._id, {
      avatar: req.body.avatar,
    });

    if (!doc) return res.send(500, { error: err });
    return res.send({
      status: true,
      message: "Avatar Changed Successfully",
      user: {
        ...doc,
      },
    });
  } else {
    return res.json({ status: false });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body;
  let errors = [];

  if (!bcrypt.compareSync(currentPassword, req.user.password))
    errors.push("Wrong password 😕");
  if (password != confirmPassword) errors.push("You password didn't match 😕");
  if (bcrypt.compareSync(password, req.user.password))
    errors.push("You can't use your current password as a new password 😑");

  if (errors.length) {
    return res.send({
      status: false,
      messages: errors,
    });
  }
  try {
    await User.findByIdAndUpdate(req.user._id, {
      password: bcrypt.hashSync(password, 8),
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      messages: ["OoOps Something went wrong 🥴"],
    });
  }
  return res.send({
    status: true,
    messages: ["Your password updated successfully 👍️"],
  });
};

exports.getInfo = async function (req, res) {
  const { username } = req.query;
  const user = await User.findOne({ username }).select("-password").exec();

  if (user) {
    return res.status(200).send({
      status: true,
      message: "Successfull",
      user: user,
    });
  } else {
    return res.status(200).send({
      status: false,
      message: "User not found",
    });
  }
};

exports.getTopRacers = async function (req, res) {
  const { c = 10, by = "speed" } = req.query;
  let field = "avglst_speed";

  if (by == "score") field = "avglst_score";
  try {
    const users = await User.aggregate([
      {
        $match: {
          [field]: {
            $gt: 0,
          },
        },
      },
      {
        $sort: {
          [field]: -1,
        },
      },
      {
        $project: {
          _id: 0,
          avatar: 1,
          username: 1,
          fullName: 1,
          [field]: 1,
          lvl: 1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    if (users) {
      return res.send({ status: true, message: "successfull", data: users });
    }
    throw new Error("no users found");
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "OoOps Something went wrong :(" });
  }
};
