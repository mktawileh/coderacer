const socketio = require("socket.io");
const authHandler = require("./middlewares/socketAuth");
const getCode = require("./middlewares/socketGetCode");
const getTrack = require("./middlewares/socketGetTrack");

const RaceConnection = require("./sockets/race.socket");
const PracticeConnection = require("./sockets/practice.socket");

function SocketIO(server) {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use(authHandler);
  io.use(getCode);
  io.use(getTrack);
  io.on("connection", (socket, next) => {
    const { c: conn } = socket.handshake.query || {};
    if (conn == "race") {
      return new RaceConnection(io, socket);
    }
    if (conn == "practice") {
      return new PracticeConnection(io, socket);
    }
    socket.disconnect();
  });
  return io;
}
module.exports = SocketIO;
