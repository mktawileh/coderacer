import { useEffect, useState } from "react";
import axios from "axios";
import Link from "./components/Link";
import Tooltip from "./components/Tooltip";
import Levels from "../utils/levels";

import { getUnit, calcSpeed } from "../utils/speed";

function TopRacers({ data = [], noNames = false }) {
  const [racers, setRacers] = useState(data);
  const [refresh, setRefresh] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [loading, setLoading] = useState(true);
  const speedUnit = getUnit();
  useEffect(() => {
    if (!refresh && racers.length) return;
    setLoading(true);
    setShowButton(false);
    async function fetchData() {
      const result = await axios.get("/api/get-top");
      if (result.status == 200 && result.data.status) {
        setRacers(result.data.data);
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

  return (
    <div className="p-3 section top-racer">
      <div className="header">
        <h6>Top Racers in the website 😁</h6>
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
              <th scope="col">#Place</th>
              <th scope="col">Racer</th>
              <th scope="col">Avg. Speed</th>
            </tr>
          </thead>
          <tbody className={loading ? "placeholder-wave" : ""}>
            {loading
              ? new Array(3).fill(0).map((e, i) => (
                  <tr key={i}>
                    <th>
                      <span className="placeholder col-12"></span>
                    </th>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                    <td>
                      <span className="placeholder col-12"></span>
                    </td>
                  </tr>
                ))
              : racers.map((u, k) => (
                  <tr key={k}>
                    <th scope="row">#{k + 1}</th>

                    <td>
                      <div className="user-av-us">
                        <div className={`avatar _${u.avatar}`}></div>
                        <Link
                          className={`username ${Levels[u.lvl]}-lvl`}
                          to={`/user/${u.username}`}
                        >
                          <Tooltip
                            text={Levels[Levels[u.lvl]] + ". " + u.fullName}
                          >
                            {u.username}
                          </Tooltip>
                        </Link>
                        {!noNames ? (
                          <span className="ms-1"> ({u.fullName})</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                    <td>
                      <b>{calcSpeed(u.avglst_speed)} </b>
                      <Tooltip text={speedUnit[1]}>{speedUnit[0]}</Tooltip>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopRacers;
