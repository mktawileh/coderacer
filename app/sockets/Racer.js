const Race = require("../models/race");
const Stat = require("../models/stat");

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

class Racer {
  constructor(user = null) {
    this.user = user;
    this.userId = user ? user._id : null;
    this.initProps(false);
  }

  initProps(skip = true) {
    if (!this.finished && skip) return false;
    this.raceId = null;
    this.started_at = null;
    this.mistakes = new Map();
    this.segmentsSpeeds = [];
    this.currentProgress = 0;
    this.charCount = 0;
    this.value = "";
    this.publicStat = false;
    this.finished = false;
    this.stat = null;
  }

  start(raceId, code) {
    this.code = code;
    this.total = this.code.words.length;
    this.totalChar = this.code.words.join("").length;
    this.initProps();
    this.raceId = raceId;
    this.started_at = this.started_at || Date.now();
  }

  progress(word) {
    if (!this.started_at) return false;

    if (this.code.words[this.currentProgress] != word.trim()) return false;
    this.charCount += this.code.words[this.currentProgress].length;
    this.currentProgress++;
    this.value += word;
    if (this.total == this.currentProgress) this.finished = true;
    return this.finished;
  }

  mistake(word = "") {
    if (!this.started_at) return false;
    let count = this.mistakes.get(word.trim());
    if (count) this.mistakes.set(word, count + 1);
    else this.mistakes.set(word, 1);
    return true;
  }

  progressSegment() {
    if (!this.started_at) return false;
    const pr = this.calcProgress();
    this.segmentsSpeeds.push(pr.speed);
    return true;
  }

  calcProgress() {
    const time = (Date.now() - this.started_at) / 1000;
    const speed = parseInt(this.charCount / 2 / (time / 60));
    const progress = parseInt((this.charCount / this.totalChar) * 100);
    return { speed, progress };
  }

  async getStat(place = 0) {
    const time = (Date.now() - this.started_at) / 1000;
    const acc = parseInt(
      ((this.total - this.mistakes.size) / this.total) * 100
    );
    const cwpm = parseInt(this.charCount / 2 / (time / 60));

    // Caculate the beauty of the code by comparing the space
    // between the code in the database and the user input
    const codeSpaces = [];
    let sumOfMatchedSpaces = 0;
    for (let i = 0, j = 0; i < this.code.value.length; j++) {
      let size = this.code.value.substr(i).indexOf(this.code.words[j]);
      codeSpaces.push(size);
      if (j == this.total) i = this.code.value.length;
      else i += size + this.code.words[j].length;
    }
    for (let i = 0, j = 0; i < this.value.length; j++) {
      let size = this.value.substr(i).indexOf(this.code.words[j]);
      if (codeSpaces[j] == size) sumOfMatchedSpaces++;
      if (j == this.total) i = this.value.length;
      else i += size + this.code.words[j].length;
    }
    const beauty = parseInt((sumOfMatchedSpaces / codeSpaces.length) * 100);
    const score = parseInt(cwpm * (acc / 100) * (beauty / 100));
    this.segmentsSpeeds.push(cwpm);
    let result = {
      time,
      cwpm,
      mistakes: Object.fromEntries(this.mistakes.entries()),
      acc,
      score,
      value: this.value,
      beauty,
      spd: this.segmentsSpeeds,
      finished: true,
      place,
    };
    this.stat = result;
    return result;
  }

  async updateUser() {
    if (!this.user || !this.stat) return;
    const result = await Race.findByIdAndUpdate(this.raceId, this.stat, {
      new: true,
    });

    this.user.hst_speed = Math.max(this.stat.cwpm, this.user.hst_speed || 0);
    this.user.hst_score = Math.max(this.stat.score, this.user.hst_score || 0);

    const stat = await Race.aggregate([
      {
        $facet: {
          avg: [
            {
              $match: {
                owner: this.userId,
              },
            },
            {
              $sort: {
                start_at: -1,
              },
            },
            {
              $limit: 100,
            },
            {
              $group: {
                _id: null,
                speed: {
                  $avg: "$cwpm",
                },
                score: {
                  $avg: "$score",
                },
              },
            },
          ],
          lst: [
            {
              $match: {
                owner: this.userId,
              },
            },
            {
              $sort: {
                start_at: -1,
              },
            },
            {
              $limit: 10,
            },
            {
              $group: {
                _id: null,
                speed: {
                  $avg: "$cwpm",
                },
                score: {
                  $avg: "$score",
                },
              },
            },
          ],
        },
      },
    ]);

    const data = stat[0];

    this.user.avg_speed = parseInt(data.avg[0].speed);
    this.user.avglst_speed = parseInt(data.lst[0].speed);
    this.user.avg_score = parseInt(data.avg[0].score);
    this.user.avglst_score = parseInt(data.lst[0].score);
    this.user.total_score = (this.user.total_score || 0) + result.score;

    if (this.user.avglst_speed >= 150) {
      this.user.lvl = 5;
    } else if (this.user.avglst_speed >= 109) {
      this.user.lvl = 4;
    } else if (this.user.avglst_speed >= 83) {
      this.user.lvl = 3;
    } else if (this.user.avglst_speed >= 61) {
      this.user.lvl = 2;
    } else if (this.user.avglst_speed >= 40) {
      this.user.lvl = 1;
    } else {
      this.user.lvl = 0;
    }

    if ((this.user.best_lvl || 0) < this.user.lvl) {
      this.user.best_lvl = this.user.lvl;
      this.user.hst_avglst_speed = this.avglst_speed;
    }
    const resultStat = {
      hst_speed: this.user.hst_speed,
      hst_score: this.user.hst_score,
      avg_speed: this.user.avg_speed,
      avg_score: this.user.avg_score,
      avglst_speed: this.user.avglst_speed,
      avglst_score: this.user.avglst_score,
      total_score: this.user.total_score,
    };
    await Stat.create({
      ...resultStat,
      owner: this.user._id,
      race: this.raceId,
    });
    await this.user.save();
    return {
      ...resultStat,
      lvl: this.user.lvl,
      best_lvl: this.user.best_lvl,
    };
  }

  async discardRace() {
    if (!this.raceId) return;
    if (this.currentProgress == this.total) return;

    await Race.findByIdAndRemove(this.raceId);
    this.initProps(false);
  }
}

module.exports = Racer;
