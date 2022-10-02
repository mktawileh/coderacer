import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import axios from "axios";
import io from "socket.io-client";

import Page from "../../view/Page";
import RaceInfo from "../../view/RaceInfo";
import AnalysisRace from "../../view/AnalysisRace";
import CodeScoreBoard from "../../view/CodeScoreBoard";

import RaceInput from "../../view/components/RaceInput";
import RacingTrack from "../../view/components/RacingTrack";
import Loader from "../../view/components/Loader";
import SideBar from "../../view/SideBar";
import Countdown from "../../view/components/Countdown";

function RacePage({ userState }) {
  const [user, setUser] = userState;
  const router = useRouter();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState({});
  const [raceId, setRaceId] = useState(null);
  const [running, setRunning] = useState(false);
  const [users, setUsers] = useState({});
  const [usersCount, setUsersCount] = useState(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastProgress, setLastProgress] = useState({ progress: 0, value: "" });
  const [speed, setSpeed] = useState(0);
  const [stat, setStat] = useState({});
  const [ustat, setUstat] = useState({});
  const [usersFinised, setUsersFinised] = useState([]);

  useEffect(() => {
    setLoading(true);
    async function fetch() {
      const id = new URL(document.location).searchParams.get("track");
      if (id) {
        const res = await axios.get("/api/track/check", {
          params: { id },
        });
        if (res.data.status) {
          setTrack(id);
        } else {
          router.push({ query: {} });
          setTrack(null);
        }
      }
      setLoading(false);
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!track) return;

    const newSocket = io(
      `${window.location.protocol}//${window.location.host}/`,
      {
        query: { track, c: "race" },
      }
    );

    newSocket.on("urs", handleGetUsers);
    newSocket.on("lp", handleLastProgress);

    setSocket(newSocket);

    return () => {
      // newSocket.off("connect");
      // newSocket.off("disconnect");
    };
  }, [track]);

  useEffect(() => {
    if (!socket) return;
    socket.on("nw", handleNewRace);
    socket.on("uj", handleUserJoin);
    socket.on("ul", handleUserLeave);
    socket.on("npr", handleNewProgress);
    socket.on("g", finish);
    socket.on("stat", handleStat);
    socket.on("ustat", handleUserStat);
    socket.on("x", handleRaceEnd);
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!done) return;
    socket.emit("d");
  }, [done]);

  const handleNewRace = async (data = null) => {
    let id = null,
      st = null,
      rid = null;
    if (data) {
      id = data[0];
      st = data[1];
      if (data.length == 3) rid = data[2];
    } else {
      id = await fetchCodeId();
    }

    const race = await fetchRace(id, st, rid);
    if (!data) socket.emit("code", [id, race.start_at]);
    if (race) {
      setRunning(true);
      const { code, id, start_at } = race;
      setRaceId(id);
      setDone(false);
      setProgress(0);
      setSpeed(0);
      setStat({});
      setUstat({});
      setUsersFinised([]);
      setUsers((oldU) => {
        const newU = Object.assign({}, oldU);
        for (let username in newU) {
          newU[username].speed = 0;
          newU[username].progress = 0;
        }
        return newU;
      });
      code.startAt = start_at;
      setCode(code);
    }
  };

  const handleGetUsers = (data) => {
    const us = {};
    const uss = {};
    for (let username in data) {
      us[username] = {
        avatar: data[username].a,
        speed: 0,
        progress: 0,
      };
      if (data[username].stat)
        uss[username] = {
          ...data[username].stat,
        };
      setUsersCount((e) => e + 1);
    }

    setUstat(uss);
    setUsers(us);
  };

  const handleUserJoin = (data) => {
    setUsers((oldUs) => {
      const us = Object.assign({}, oldUs);
      us[data.u] = {
        avatar: data.a,
        speed: 0,
        progress: 0,
      };
      setUsersCount((e) => e + 1);
      return us;
    });
  };

  const handleUserLeave = (data) => {
    let ind = usersFinised.indexOf(data);
    if (ind == -1) {
      setUsers((oldUs) => {
        const us = Object.assign({}, oldUs);
        delete us[data];
        return us;
      });
      setUsersCount((e) => e - 1);

      return;
    }

    setUsers((oldUs) => {
      const us = Object.assign({}, oldUs);
      us[data].offline = true;
      return us;
    });
  };

  const handleNewProgress = (data) => {
    try {
      const username = user.username;

      const u = data.filter((e) => e.u == username)[0];
      setUsers((oldUs) => {
        const us = Object.assign({}, oldUs);
        data.map((e) => {
          if (e.u != username && us.hasOwnProperty(e.u)) {
            us[e.u].speed = e.speed;
            us[e.u].progress = e.progress;
          }
        });
        return us;
      });

      if (typeof u == "object") {
        setProgress(u.progress);
        setSpeed(u.speed);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLastProgress = (data) => {
    if (data.length) setLastProgress({ progress: data[0], value: data[1] });
  };

  const finish = () => {
    if (!socket) return;
    setDone(true);
  };

  const handleStat = (data) => {
    setRunning(true);
    setUser((oldUser) => {
      let newUser = Object.assign({}, oldUser);
      newUser = {
        ...newUser,
        hst_speed: data.hst_speed,
        hst_score: data.hst_score,
        avg_speed: data.avg_speed,
        avg_score: data.avg_score,
        avglst_speed: data.avglst_speed,
        avglst_score: data.avglst_score,
        lvl: data.lvl,
        bst_lvl: data.bst_lvl,
      };

      if (oldUser.best_lvl != newUser.best_lvl) {
        startConfetti();
        toast(
          <h5 className="p-1">
            {Message["became_" + Levels[newUser.best_lvl]](newUser.fullName)}
          </h5>,
          {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => stopConfetti(),
          }
        );
      } else if (oldUser.lvl != newUser.lvl) {
        toast(
          <>
            You became {newUser.lvl == 3 ? "an" : "a"}{" "}
            <span className={`${Levels[newUser.lvl]}-lvl`}>
              {Levels[Levels[newUser.lvl]]} Racer
            </span>
          </>,
          {
            position: "top-center",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      return newUser;
    });
    setStat(data);
  };

  const handleUserStat = (data) => {
    setUstat((oldUt) => {
      const ut = Object.assign({}, oldUt);
      ut[data.u] = {
        cwpm: data.cwpm,
        score: data.score,
        acc: data.acc,
        beauty: data.beauty,
        time: data.time,
        place: data.place,
      };
      return ut;
    });
  };

  const handleRaceEnd = () => {
    setRunning(false);
  };

  const fetchCodeId = async () => {
    if (!track) return null;
    if (!localStorage.getItem("rndm")) {
      setLoading(true);
      const token = localStorage.getItem("token");
      const result = await axios.get("/api/code/grc", {
        headers: {
          auth: `JWT ${token}`,
        },
      });
      if (result.status == 200 && result.data.status) {
        localStorage.setItem("rndm", result.data.data);
      } else {
        toast.error("OoOps Something went wrong :(");
      }
    }
    let racesIds = localStorage.getItem("rndm").split(",");
    if (racesIds) {
      const raceId = racesIds.splice(0, 1);
      localStorage.setItem("rndm", racesIds);
      return raceId[0];
    }
  };

  const fetchRace = async (id, startingTime = null, rid = null) => {
    let result;
    if (rid) {
      result = await axios.get("/api/race/get-with-code", {
        params: { id: rid, cid: id },
      });
    } else {
      result = await axios.post("/api/race/add", { id, st: startingTime });
    }
    if (result.status == 200 && result.data.status) {
      return result.data;
    } else {
      toast.error("OoOps something went wrong :(");
      return null;
    }
  };

  const handleNewTrack = async () => {
    const res = await axios.get("/api/track/get");
    if (res.status == 200 && res.data.status) {
      setTrack(res.data.id);
      router.push({
        query: {
          track: res.data.id,
        },
      });
    }
  };

  if (loading) return <Loader />;

  const urs = new Array();

  for (let username in users) {
    urs.push({
      username,
      avatar: users[username].avatar,
      progress: users[username].progress,
      speed: users[username].speed,
    });
  }

  return (
    <Page sideBar={<SideBar />} className="race-page">
      {!track ? (
        <div className="link-container">
          <button className="btn-primary btn" onClick={handleNewTrack}>
            Create a new track 😃
          </button>
        </div>
      ) : (
        <div className="form-group mb-0">
          <div className="form-label">
            Send this link to your friends to start a race
          </div>
          <input
            type="text"
            className="form-control"
            readOnly
            value={window.location.host + "/race/with-friends?track=" + track}
            style={{ marginBottom: 1 + "rem" }}
          />
        </div>
      )}
      <RacingTrack
        userState={userState}
        speed={speed}
        progress={progress}
        stat={stat}
        users={urs}
        ustat={ustat}
      />
      {track ? (
        <>
          <div className="mb-3 text-end">
            <div className="timer-box">
              <Countdown date={code.startAt} freeze={done} />
            </div>
          </div>
          <RaceInput
            code={code}
            lastProgress={lastProgress}
            onNewRace={handleNewRace}
            done={done}
            waiting={running || !usersCount}
            onCorrectWord={({ value }) => {
              socket.emit("pr", value);
            }}
            onNewLine={({ line }) => {
              socket.emit("br", line);
            }}
            onStart={() => {
              socket.emit("s", raceId);
            }}
            onError={({ word }) => {
              socket.emit("er", word);
            }}
          />
          <RaceInfo code={code} show={done} />
          <AnalysisRace show={done} code={code} {...stat} />
        </>
      ) : (
        ""
      )}
      <CodeScoreBoard
        codeId={code._id ? code._id.toString() : null}
        show={done}
      />
    </Page>
  );
}

export default RacePage;
