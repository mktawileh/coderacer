var Code = require("../models/code");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
loadLanguages(["cpp"]);

function makeWords(code) {
  const tokens = Prism.tokenize(code, Prism.languages.cpp);
  let words = [];
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] == "object") {
      words.push(tokens[i].content.trim());
    }
    if (typeof tokens[i] == "string" && tokens[i].trim()) {
      if (tokens[i].trim().indexOf(" ") > -1) {
        words.push(...tokens[i].trim().split(" "));
      } else {
        words.push(tokens[i].trim());
      }
    }
  }
  return words;
}

exports.add = async function (req, res) {
  const { data, title = "" } = req.body;
  if (data) {
    const code = new Code({
      value: data,
      words: makeWords(data),
      title,
      updated_at: Date.now(),
      user: req.user._id.toString(),
    });
    try {
      const result = await code.save();
      return res.status(200).send({
        status: true,
        message: "The code has been added successfully :)",
        data: result,
      });
    } catch (err) {
      return res.status(500).send({
        status: false,
        message: "Sorry, there were some thing wrong :(",
      });
    }
  }
  return res.status(200).send({
    status: false,
    message: "Code can't be empty :(",
  });
};

exports.update = async (req, res) => {
  const { data, id, title } = req.body;
  if (data && id) {
    try {
      const code = await Code.findById(id);
      if (code) {
        code.value = data;
        code.words = makeWords(data);
        code.updated_at = Date.now();
        if (title) {
          code.title = title;
        }
        await code.save();
        return res.send({
          status: true,
          message: "Your changes had been updated successfully :)",
          data: code,
        });
      } else {
        return res.send({
          status: false,
          message: "Sorry, there is no code in the database with that id :(",
        });
      }
    } catch (err) {
      console.log(err);
      return res.send({
        status: false,
        message: "Sorry, there is no code in the database with that id :(",
      });
    }
  }
};

exports.del = async (req, res) => {
  const { id } = req.body;
  if (id) {
    try {
      const code = await Code.findById(id);

      if (code && !code.deleted) {
        code.deleted = true;
        await code.save();
        return res.send({
          status: true,
          message: "The code had been deleted :)",
        });
      } else {
        return res.send({
          status: false,
          message: "Sorry, there is no code in the database with that id :(",
        });
      }
    } catch (err) {
      return res.send({
        status: false,
        message: "Sorry, there is no code in the database with that id :(",
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
    const code = await Code.findById(id);
    if (code && !code.deleted) {
      return res.status(200).send({
        status: true,
        message: "Successfull",
        code,
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "Code is not found",
      });
    }
  } catch (err) {
    return res.status(200).send({
      status: false,
      message: "Code is not found",
    });
  }
};

exports.getAll = async function (req, res) {
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
