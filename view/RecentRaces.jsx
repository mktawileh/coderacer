import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Link from "./components/Link";
import Tooltip from "./components/Tooltip";
import { calcSpeed, getUnit } from "../utils/speed";
import Levels from "../utils/levels";

export default function RecentRaces({
  data = [],
  noNames = false,
  noScore = false,
}) {
  const [races, setRaces] = useState(data);
  const [refresh, setRefresh] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const speedUnit = getUnit();

  useEffect(() => {
    if (!refresh && data.length) return;
    setLoading(true);
    setShowButton(false);
    async function fetchData() {
      if (races.length && !refresh) return;
      const result = await axios.get("/api/race/get-recent");
      if (result.status == 200 && result.data.status) {
        setRaces(result.data.data);
        setLoading(false);
        setTimeout(() => {
          setShowButton(true);
        }, 1000 * 60);
      } else {
        console.error(result.data.message);
      }
    }
    fetchData();
  }, [refresh]);
  if (!races.length) return "";

  return (
    <div className="p-3 section top-racer">
      <div className="header">
        <h5>Recent Races</h5>
        {showButton ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setRefresh((e) => e + 1)}
          >
            Refresh
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="score-board-container">
        <table className="table align-middle table-striped">
          <thead>
            <tr>
              <th scope="col">Speed</th>
              {noScore ? "" : <th scope="col">Score</th>}
              <th scope="col">Racer</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody className={loading ? "placeholdler-glow" : ""}>
            {loading
              ? new Array(10).fill(0).map((e, i) => (
                  <tr key={i}>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                  </tr>
                ))
              : races.map((race, k) => (
                  <tr key={k}>
                    <td>
                      <b>{calcSpeed(race.cwpm)} </b>
                      <Tooltip text={speedUnit[1]}>{speedUnit[0]}</Tooltip>
                    </td>
                    {noScore ? (
                      ""
                    ) : (
                      <td>
                        <b>{race.score} </b>
                        Point
                      </td>
                    )}
                    <td>
                      <div className="user-av-us">
                        <div className={`avatar _${race.user[0].avatar}`}></div>
                        <Link
                          className={`username ${Levels[race.user[0].lvl]}-lvl`}
                          to={`/user/${race.user[0].username}`}
                        >
                          <Tooltip
                            text={
                              Levels[Levels[race.user[0].lvl]] +
                              ". " +
                              race.user[0].fullName
                            }
                          >
                            {race.user[0].username}
                          </Tooltip>
                        </Link>
                        {!noNames ? (
                          <span className="ms-1">
                            {" "}
                            ({race.user[0].fullName})
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                    <td>
                      <Tooltip
                        text={moment(race.start_at).format("Y / M / D [at] LT")}
                      >
                        {moment(race.start_at).fromNow()}
                      </Tooltip>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
