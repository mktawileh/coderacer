import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Tooltip from "./components/Tooltip";
import Link from "./components/Link";

import { getUnit, calcSpeed } from "../utils/speed";

function CodeScoreBoard({ codeId, show }) {
  if (!show) return;
  const [scores, setScores] = useState([]);
  useEffect(() => {
    async function fetchData() {
      if (!codeId) return;
      const result = await axios.get("/api/race/get-csb", {
        params: {
          cid: codeId,
        },
      });

      if (result.status == 200 && result.data.status) {
        setScores(result.data.data);
      }
    }
    fetchData();
  }, [codeId]);

  const speedUnit = getUnit();

  return (
    <div className="p-3 section">
      <h5>Scores for this code 😃</h5>
      <div className="score-board-container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Score</th>
              <th scope="col">User</th>
              <th scope="col">Date</th>
              <th scope="col">Speed</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, k) => (
              <tr key={k}>
                <th scope="row" className="place">
                  {k + 1}
                </th>
                <td>
                  <b>{s.score}</b>
                </td>
                <td>
                  <div className="user-av-us">
                    <div className={`avatar _${s.user[0].avatar}`}></div>
                    <div className={`username ${s.user[0].lvl}-lvl`}>
                      <Link
                        className={`${s.user[0].lvl}-lvl`}
                        to={`/user/${s.user[0].username}`}
                      >
                        {s.user[0].username}
                      </Link>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="clickable-text">
                    <Link to={`/race/analysis/${s._id.toString()}`}>
                      <Tooltip
                        text={moment(s.start_at).format("Y / M / D [at] LT")}
                      >
                        {moment(s.start_at).fromNow()}
                      </Tooltip>
                    </Link>
                  </div>
                </td>
                <td>
                  <b>{calcSpeed(s.cwpm)}</b> {speedUnit[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CodeScoreBoard;
