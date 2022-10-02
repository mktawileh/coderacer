import Link from "./Link";

import { getUnit, calcSpeed } from "../../utils/speed";

function Racer(props) {
  const {
    user = false,
    username,
    avatar,
    progress = 0,
    speed = 0,
    card = true,
  } = props;
  let { stat } = props;
  stat = stat || {};

  return (
    <div className={`racer-road${user ? " user" : ""}`}>
      <div className="racing-area">
        <div
          className={`racer${stat.cwpm ? " finished" : ""}`}
          style={{ left: (stat.cwpm ? 100 : progress) + "%" }}
        >
          <div className={`avatar _${avatar}`}>
            {stat.place ? (
              <div className="place">
                #<b>{stat.place}</b>
              </div>
            ) : (
              ""
            )}
          </div>
          {stat.cwpm && card ? (
            <div className="card">
              <div className="card-header">
                <Link to={`/user/${username}`}>{username}</Link>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Accurecy: {stat.acc}%</li>
                <li className="list-group-item">Code Beauty: {stat.beauty}%</li>
                <li className="list-group-item">Score: {stat.score}+</li>
                <li className="list-group-item">Time: {stat.time}</li>
              </ul>
            </div>
          ) : (
            ""
          )}

          {!stat.cwpm ? <span className="name">{username}</span> : ""}
        </div>
      </div>
    </div>
  );
}

function Stat(props) {
  const { speed } = props;
  const speedUnit = getUnit();

  return (
    <div className="stat">
      <div className="speed">
        <span>{calcSpeed(speed)}</span>
        <span className="unit"> {speedUnit[0]}</span>
      </div>
    </div>
  );
}

export default function RacingTrack(props) {
  const { users = [], progress = 0, speed = 0, userState } = props;
  let { stat, ustat } = props;
  stat = stat || {};
  ustat = ustat || {};
  const [user, setUser] = userState;

  return (
    <div className="racing-road-section mb-3">
      <div className="wrapper">
        <div className="outer-road">
          <div className="road">
            <Racer
              username={user.username || "guest"}
              avatar={user.avatar || "z"}
              speed={speed}
              progress={progress}
              stat={stat}
              card={users && users.length}
            />
            {users.map((e, i) => (
              <Racer
                key={i}
                username={e.username}
                avatar={e.avatar}
                progress={e.progress}
                stat={ustat[e.username]}
              />
            ))}
          </div>
        </div>
        <div className="stat-container">
          <span className="finish-line"></span>
          <Stat speed={stat.cwpm || speed} />
          {users.map((e, i) => (
            <Stat
              key={i}
              speed={
                ustat[users[i].username] && ustat[users[i].username].cwpm
                  ? ustat[users[i].username].cwpm
                  : e.speed
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
