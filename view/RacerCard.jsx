import Link from "next/link";
import Levels from "../utils/levels";
import Tooltip from "./components/Tooltip";
import { getUnit, calcSpeed } from "../utils/speed";

export default function RacerCard({ user, show = true }) {
  if (!user || !user.username || !show) return "";
  const unitOfSpeed = getUnit();
  return (
    <div className="box">
      <div className="row">
        <div className="col-lg-6 mb-lg-0 mb-sm-3">
          <div className="user-info">
            <div className="avatar-wrapper">
              <span className={`avatar _${user.avatar} big`}></span>
            </div>
            <div className="user-name ms-3">
              <div className="name">
                <Link href={`/user/${user.username}`} passHref>
                  <a className="link h5">
                    <span className={`${Levels[user.lvl]}-lvl clickable`}>
                      @{user.username}
                    </span>
                  </a>
                </Link>
                <br />
                <small>{user.fullName}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-6">
              <small>Avg. Speed:</small>
              <div className="row pt-2">
                <div className="h2 red">
                  {calcSpeed(user.avglst_speed)}{" "}
                  <span className="h5">
                    <Tooltip text={unitOfSpeed[1]}>{unitOfSpeed[0]}</Tooltip>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <small>Score:</small>
              <div className="row pt-2">
                <div className="h2 red">
                  {user.total_score}{" "}
                  <span className="h5">
                    <Tooltip text={unitOfSpeed[1]}>{unitOfSpeed[0]}</Tooltip>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
