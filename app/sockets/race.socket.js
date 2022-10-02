const tracks = new Map();
const Race = require("../models/race");
const Code = require("../models/code");
const Racer = require("./Racer");

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function startNotifyUsers(trackId) {
  const track = tracks.get(trackId);
  const finishDate = new Date(track.startingTime).getTime() + 1000 * 60 * 2;
  if (!track) return;
  const id = setInterval(() => {
    if (!track || !track.code || !track.users.size) {
      clearInterval(id);
      return;
    }
    const prs = [];
    const users = Object.fromEntries(track.users.entries());
    for (let username in users) {
      if (!users[username].publicStat) {
        const progress = users[username].racer.calcProgress();
        if (!progress) continue;
        progress.u = username;
        progress.o = !users[username].offline;
        prs.push(progress);
      }
    }
    for (let username in users) {
      const user = users[username];
      user.emit("npr", prs);
    }
    console.log(prs);
  }, 1000);

  // End the race after two minutes.

  setTimeout(() => {
    const users = Object.fromEntries(track.users.entries());
    for (let username in users) {
      users[username].endRace();
      users[username].emit("x");
    }
    resetTrack(track);
  }, finishDate - Date.now());
}

function resetTrack(track) {
  if (!track) return;
  track.finished = new Array();
  track.code = null;
  track.startingTime = null;
}

class Connection {
  constructor(io, socket) {
    this.user = socket.user;
    this.id = socket.track._id.toString();

    if (!tracks.has(this.id))
      tracks.set(this.id, {
        users: new Map(),
        finished: new Array(),
        code: null,
        offlineUsers: 0,
      });

    this.track = tracks.get(this.id);
    this.userJoin();
    this.socket = socket;
    this.informCurrentState();
    this.informUserJoin();

    socket.on("disconnect", () => this.disconnect());
    socket.on("code", (data) => this.onNewRace(data[0], data[1])); // [codeId, startingTime]
    socket.on("s", (raceId) => this.onRaceStart(raceId));
    socket.on("er", (word) => this.onMistake(word));
    socket.on("pr", (word) => this.onRacerProgress(word));
    socket.on("br", () => this.racer.progressSegment());
    socket.on("d", () => this.onRacerFinished());
    socket.on("connect_error", (err) => {
      console.log(`connect error ${err.message}`);
    });
  }

  userJoin() {
    // If the user were in the track, use his old racer object to continue the race.
    if (
      tracks.has(this.id) &&
      this.track.users.size > 0 &&
      this.track.users.get(this.user.username)
    ) {
      Object.assign(this, this.track.users.get(this.user.username));
    } else {
      this.racer = new Racer(this.user);
      this.offline = false;
    }
    this.track.users.set(this.user.username, this);
    // keep tracking the number of offline users in the current session
    if (this.offline) this.track.offlineUsers--;
    this.offline = false;
  }

  informUserJoin() {
    this.emitToOthers("uj", {
      u: this.user.username,
      a: this.user.avatar,
    });
  }

  informCurrentState() {
    this.emit("urs", this.getOtherUsers());
    if (this.track.code) {
      if (!this.racer.finished) {
        this.emit("nw", [
          this.track.code._id.toString(),
          this.track.startingTime,
          this.racer.raceId,
        ]);
        this.emit("lp", [this.racer.currentProgress, this.racer.value]);
      } else {
        this.emit("g");
      }
    }
  }

  userLeave() {
    this.track.offlineUsers++;
    this.offline = true;
    this.emitToOthers("ul", this.user.username);
  }

  getOtherUsers() {
    const users = Object.fromEntries(this.track.users.entries());
    const res = {};
    for (let username in users) {
      if (this.user.username == username) continue;
      res[username] = {
        a: users[username].user.avatar,
      };
      if (users[username].racer.finished && this.track.code) {
        res[username].stat = users[username].publicStat;
      }
      res[username].o = !users[username].offline;
    }
    return res;
  }

  async onNewRace(codeId, startingTime) {
    if (this.track.code) {
      this.emit("error", "code already selected");
      return;
    }
    const code = await Code.findById(codeId);
    if (!code) {
      this.emit("error", "code not found");
      return;
    }

    this.track.code = code;
    this.track.startingTime = startingTime;
    this.emitToOthers("nw", [codeId, startingTime]);

    setTimeout(() => {
      startNotifyUsers(this.id);
    }, new Date(startingTime).getTime() - Date.now());
  }

  onRaceStart(raceId) {
    this.racer.start(raceId, this.track.code);
  }

  onMistake(word) {
    this.racer.mistake(word);
  }

  onRacerProgress(word) {
    if (this.racer.progress(word)) {
      this.emit("g");
    }
  }

  async onRacerFinished() {
    if (this.track.finished.indexOf(this.user.username) >= 0) {
      this.emit("stat", this.racer.stat);
      return;
    }

    this.track.finished.push(this.user.username);
    // Passing the place of the user in the race
    let raceStat = await this.racer.getStat(this.track.finished.length);
    let userStat = await this.racer.updateUser();

    const { cwpm, score, acc, beauty, place, time } = raceStat;
    this.publicStat = {
      u: this.user.username,
      cwpm,
      score,
      acc,
      beauty,
      time,
      place,
    };

    this.emit("stat", { ...raceStat, ...userStat });
    this.emitToOthers("ustat", this.publicStat);
    this.checkRaceFinished();
  }

  checkRaceFinished() {
    const { track } = this;
    if (track.finished.length == track.users.size - track.offlineUsers) {
      const users = Object.fromEntries(track.users.entries());
      for (let username in users) {
        users[username].endRace();
      }
      resetTrack(this.track);
      this.emitToAll("x");
    }
  }

  async endRace() {
    if (!this.track.code) return;
    if (!this.offline && !this.racer.finished) {
      await this.onRacerFinished();
    }
    this.racer.discardRace();
  }

  disconnect() {
    this.userLeave();
  }

  emit(name, value) {
    this.socket.emit(name, value);
  }

  emitToOthers(name, value) {
    const users = Object.fromEntries(this.track.users.entries());
    for (let username in users) {
      const user = users[username];
      if (username != this.user.username) user.emit(name, value);
    }
  }

  emitToAll(name, value) {
    const users = Object.fromEntries(this.track.users.entries());
    for (let username in users) {
      const user = users[username];
      user.emit(name, value);
    }
  }
}

module.exports = Connection;
