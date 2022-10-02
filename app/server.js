const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");
const socket = require("./socket");
const guestMiddleware = require("./middlewares/guest");
const getUserMiddleware = require("./middlewares/getUser");

const httpServer = (express) => {
  return require("http").createServer(express);
};

class Server {
  constructor(port) {
    this.port = port;
    this.express = express();
    this.next = next({ dev: process.env.NODE_ENV !== "production" });
    this.router = router(this.express, this.next);
  }

  async connectDB() {
    try {
      mongoose.connect(process.env.MONGODB_URL, {
        // mongoose.connect("mongodb://localhost:27017/coderacer", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log("Connected to the DB Successfully");
    } catch (error) {
      console.error(error);
    }
  }

  async start() {
    await this.connectDB();
    await this.next.prepare();
    this.middlewares();
    await this.router.init();
    this.server = httpServer(this.express);
    this.socket = socket(this.server);
    this.server.listen(process.env.EXPRESS_PORT);
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(cookieParser());
    this.express.use(
      express.urlencoded({
        extended: true,
      })
    );
    this.express.use(getUserMiddleware);
    this.express.use(guestMiddleware);
    this.express.use(express.static("./public"));
  }
}

module.exports = Server;
