const Race = require("../models/race");
const Racer = require("./Racer");

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

class PracticeConnection {
  constructor(io, socket) {
    this.socket = socket;
    this.raceId = socket.handshake.query.raceId;
    this.io = io;
    this.racer = new Racer(socket.user);
    socket.on("disconnect", () => this.disconnect());
    socket.on("d", () => this.onRaceEnd());
    socket.on("s", () => this.onRaceStart());
    socket.on("pr", (word) => this.onRacerProgress(word));
    socket.on("br", () => this.racer.progressSegment());
    socket.on("e", (word) => this.onMistake(word));
    socket.on("connect_error", (err) => {
      console.log(`connect error d to ${err.message}`);
    });
  }

  emit(name, value) {
    this.socket.emit(name, value);
  }

  onRaceStart() {
    this.racer.start(this.raceId, this.socket.code);
    this.startNotifyProgress();
  }

  onMistake(word) {
    this.racer.mistake(word);
  }

  onRacerProgress(data) {
    if (this.racer.progress(data)) {
      this.emit("g");
    }
  }

  async onRaceEnd() {
    let stat = await this.racer.getStat();
    if (this.socket.user) {
      stat = { ...(await this.racer.updateUser()), ...stat };
    }
    this.emit("stat", stat);
    this.racer.discardRace();
    this.socket.disconnect();
  }

  startNotifyProgress() {
    const id = setInterval(() => {
      if (this.racer.finished) {
        clearInterval(id);
        return;
      }
      this.emit("npr", this.racer.calcProgress());
    }, 1000);

    const finishDate =
      new Date(this.racer.started_at).getTime() + 1000 * 60 * 2;
    setTimeout(async () => {
      if (!this.racer.finished) {
        this.emit("g");
      }
    }, finishDate - Date.now());
  }

  disconnect() {
    this.racer.discardRace();
  }
}

module.exports = PracticeConnection;
