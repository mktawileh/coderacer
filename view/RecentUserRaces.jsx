import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Link from "./components/Link";
import Tooltip from "./components/Tooltip";
import { getUnit, calcSpeed } from "../utils/speed";

export default function RecentUserRaces({
  data = [],
  noNames = false,
  noScore = false,
  forceRefresh = 0,
  user = {},
}) {
  const [races, setRaces] = useState(data);
  const [refresh, setRefresh] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const speedUnit = getUnit();

  useEffect(() => {
    if ((races.length && !refresh && !forceRefresh) || !user.username) return;
    setLoading(true);
    setShowButton(false);

    async function fetchData() {
      const result = await axios.get("/api/race/get-rou");
      if (result.status == 200 && result.data.status) {
        setRaces(result.data.races);
        setLoading(false);
        setTimeout(() => {
          setShowButton(true);
        }, 1000 * 60);
      } else {
        console.error(result.data.message);
      }
    }
    fetchData();
  }, [refresh, forceRefresh]);
  if (races.length == 0) return "";
  return (
    <div className="p-3 section top-racer">
      <div className="header">
        <h5>Your recent races 😀</h5>
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
              <th scope="col">Accurecy</th>
              <th scope="col">Beauty</th>
              <th scope="col">Score</th>
              <th scope="col">Time</th>
              <th scope="col">Date</th>
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

                    <td>
                      <b>{race.acc}</b>%
                    </td>

                    <td>
                      <b>{race.beauty}</b>%
                    </td>

                    <td>
                      <b>{race.score}</b>+
                    </td>

                    <td>
                      {moment(parseInt(race.time * 1000)).format("mm:ss")}
                    </td>

                    <td>
                      <div className="clickable-text">
                        <Link to={`/race/analysis/${race._id.toString()}`}>
                          <Tooltip
                            text={moment(race.start_at).format(
                              "Y / M / D [at] LT"
                            )}
                          >
                            {moment(race.start_at).fromNow()}
                          </Tooltip>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
