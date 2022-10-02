import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import io from "socket.io-client";

import Page from "../../view/Page";
import RaceInfo from "../../view/RaceInfo";
import AnalysisRace from "../../view/AnalysisRace";
import CodeScoreBoard from "../../view/CodeScoreBoard";
import SideBar from "../../view/SideBar";

import RaceInput from "../../view/components/RaceInput";
import RacingTrack from "../../view/components/RacingTrack";
import RecentUserRaces from "../../view/RecentUserRaces";
import Countdown from "../../view/components/Countdown";

import Levels from "../../utils/levels";
import Message from "../../utils/messages";
import Celebrate from "../../view/components/Celebrate";
import { startConfetti, stopConfetti } from "../../utils/confetti";

export default function ({ userState, titleState }) {
  const [user, setUser] = userState;
  const [title, setTitle] = titleState;
  const [racerCode, setRacerCode] = useState("");
  const [code, setCode] = useState({});
  const [socket, setSocket] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState({});
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    setTitle("Practice");
  }, []);

  useEffect(() => {
    if (!raceId || socket) return;

    const newSocket = io(
      `${window.location.protocol}//${window.location.host}`,
      {
        query: { c: "practice", raceId, codeId: code._id },
      }
    );

    setSocket(newSocket);

    newSocket.on("stat", (data) => {
      setStat(data);
      setSpeed(data.cwpm);
      if (data.hst_speed) {
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
            best_lvl: data.best_lvl,
            total_score: data.total_score,
          };

          if (oldUser.best_lvl != newUser.best_lvl) {
            startConfetti();
            toast(
              <h5 className="p-1">
                {Message["became_" + Levels[newUser.best_lvl]](
                  newUser.fullName
                )}
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
      }
      setSocket(null);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
    };
  }, [raceId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("g", finish);
    socket.on("npr", handleNewProgress);
  }, [socket]);

  useEffect(() => {
    if (!done) return;
    socket.emit("d");
  }, [done]);

  const handleNewProgress = (e) => {
    setProgress(e.progress);
    setSpeed(e.speed);
  };

  const fetchCodeId = async () => {
    if (!localStorage.getItem("rndm")) {
      setLoading(true);
      const result = await axios.get("/api/code/grc");
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

  const fetchRace = async (id, pub = false) => {
    const result = await axios.post("/api/race/add", { id, public: pub });
    if (result.status == 200 && result.data.status) {
      return result.data;
    } else {
      toast.error("OoOps something went wrong :(");
      return null;
    }
  };

  const handleNewRace = async () => {
    const cid = await fetchCodeId();
    const race = await fetchRace(cid);
    if (race) {
      const { code, id, start_at } = race;
      if (id) setRaceId(id);
      else setRaceId((e) => e + 1);
      setDone(false);
      setProgress(0);
      setSpeed(0);
      setStat({});
      code.startAt = start_at;
      setCode(code);
    }
  };

  const finish = () => {
    if (!socket) return;
    setDone(true);
  };

  return (
    <Page sideBar={<SideBar />} className="race-page">
      <Celebrate />
      <RacingTrack
        userState={userState}
        speed={speed}
        progress={progress}
        stat={stat}
      />
      <div className="mb-3 text-end">
        <div className="timer-box">
          <Countdown date={code.startAt} freeze={done} />
        </div>
      </div>
      <RaceInput
        code={code}
        onValueChange={({ value }) => setRacerCode(value)}
        onNewRace={handleNewRace}
        onCorrectWord={({ word, value }) => {
          socket.emit("pr", value);
        }}
        onStart={() => {
          socket.emit("s");
        }}
        onError={({ word }) => {
          socket.emit("e", word);
        }}
        onNewLine={({ line }) => {
          socket.emit("br", line);
        }}
        done={done}
      />
      <RaceInfo code={code} show={done} />
      <AnalysisRace {...stat} show={done} code={code} owner />
      <CodeScoreBoard
        codeId={code._id ? code._id.toString() : null}
        show={done}
      />
      <RecentUserRaces
        forceRefresh={done && user.username ? code._id.toString() : null}
        user={user}
      />
    </Page>
  );
}
