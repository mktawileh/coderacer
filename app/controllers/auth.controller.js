var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");

exports.register = async (req, res) => {
  const { username, fullName, avatar, password } = req.body;
  if (username && fullName && password) {
    const usernameChk = await User.find({ username });
    const errors = [];

    if (!!usernameChk.length) {
      errors.push("Username already Exists! 😨");
    }

    if (username.length < 4) {
      errors.push(
        `The username "${username}" is not valid. username must be at least 4 characters`
      );
    }
    if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(username)) {
      errors.push(
        "Your username must look like a declaration of a variable name 😎"
      );
    }

    if (fullName.length < 5) {
      errors.push(`The name you entered is not valid`);
    }

    if (errors.length) {
      return res.send({
        status: false,
        messages: errors,
      });
    }

    const user = new User({
      fullName,
      username,
      avatar,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    try {
      await user.save();
      var token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.API_SECRET
      );

      res.clearCookie("g");
      res.cookie("t", token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
      });
      delete user.password;
      res.status(200).send({
        user,
        message: "Welcome " + user.fullName + " to our website 😁",
        status: true,
      });
    } catch (err) {
      res.status(500).send({
        message: "OoOps Something went wrong 🥴",
        status: false,
      });
      return;
    }
  } else {
    return res.json({ message: "Invalid Input" });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(200).send({
      message: "User Not found.",
      status: false,
    });
  }

  //comparing passwords
  var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  // checking if password was valid and send response accordingly
  if (!passwordIsValid) {
    return res.status(200).send({
      status: false,
      message: "Invalid Password!",
    });
  }
  //signing token with user id
  var token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.API_SECRET
  );

  //responding to client request with user profile success message and  access token .
  delete user.password;
  res.clearCookie("g");
  res.cookie("t", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  });
  res.status(200).send({
    user,
    message: "Welcome " + user.fullName + " 😀",
    status: true,
  });
};

exports.isAuth = async (req, res) => {
  const token = req.cookies.t;
  if (token) {
    try {
      const result = jwt.verify(token, process.env.API_SECRET);
      if (result.id) {
        const user = await User.findById(result.id);
        if (user) {
          return res.send({ status: true, user });
        }
      }
    } catch (error) {
      return res.status(500).send({ status: false });
    }
  }
  return res.send({ status: false });
};

exports.logout = (req, res) => {
  res.clearCookie("t");
  res.send({ status: true, message: "Successfull" });
};
