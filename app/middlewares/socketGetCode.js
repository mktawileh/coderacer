const Code = require("../models/code");

const getCode = async (socket, next) => {
  const { codeId = null } = socket.handshake.query || {};
  if (codeId) {
    const res = await Code.findById(codeId);
    if (res) {
      socket.code = res;
    }
    next();
  } else {
    socket.code = undefined;
    next();
  }
};
module.exports = getCode;
