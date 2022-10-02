const Track = require("../models/track");

const getTrack = async (socket, next) => {
  const { track = null } = socket.handshake.query || {};
  if (track) {
    const res = await Track.findById(track);
    if (res) {
      socket.track = res;
    }
    next();
  } else {
    socket.track = undefined;
    next();
  }
};
module.exports = getTrack;
