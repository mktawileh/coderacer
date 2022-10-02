import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Line } from "react-chartjs-2";
import { Form } from "react-bootstrap";
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-moment";
import { toast } from "react-toastify";
import Page from "../../view/Page";
import Loader from "../../view/components/Loader";
import Tooltip from "../../view/components/Tooltip";
import Levels from "../../utils/levels";
import { getUnit, calcSpeed } from "../../utils/speed";
import { levelsColoring } from "../../utils/chartjs-plugins";
import { getColor } from "../../utils/levels";

export async function getServerSideProps({ req, res }) {
  const pageProps = JSON.parse(req.pageProps || "{}");
  let max = 0,
    min = 1111111;

  pageProps.avg_speed_stat.map((e) => {
    max = Math.max(e.y, max);
    min = Math.min(e.y, min);
  });
  pageProps.max_y = max == 0 ? null : max;
  pageProps.min_y = min == 1111111 ? null : min;

  return {
    props: pageProps,
  };
}

function calcDateFromOption(opt) {
  const year = new Date().getFullYear().toString();
  const month = (new Date().getMonth() + 1).toString();
  switch (opt) {
    case 0:
      return 0;
    case 1:
      return new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
    case 2:
      return new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    case 3:
      return new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
    case 4:
      return new Date(Date.now() - 1000 * 60 * 60 * 24);
    case 5:
      return new Date(Date.now() - 1000 * 60 * 60 * 12);
    case 6:
      return new Date(Date.now() - 1000 * 60 * 60 * 6);
    default:
      return new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  }
}

export default function UserPage(props) {
  const [user, setUser] = useState(props.user);
  const [avgSpeedStat, setAvgSpeedStat] = useState([
    [],
    [],
    props.avg_speed_stat,
    [],
    [],
    [],
    [],
  ]);
  const [title, setTitle] = props.titleState;
  const [choosenDate, setChoosenDate] = useState(2);

  const unitOfSpeed = getUnit();
  const speedStatData = avgSpeedStat[choosenDate];

  let date = calcDateFromOption(choosenDate);

  const speedStatOptions = {
    scales: {
      x: {
        suggestedMax:
          speedStatData.length == 1
            ? new Date(
                new Date(speedStatData[0].x).getTime() +
                  (new Date(speedStatData[0].x).getTime() - date)
              )
            : undefined,
        suggestedMin: speedStatData.length == 1 ? date : undefined,
        type: "time",
        grid: {
          color: "#00000020",
        },
      },
      y: {
        suggestedMin: props.min_y ? props.min_y - 30 : 0,
        suggestedMax: props.max_y ? props.max_y + 30 : 250,
        grid: {
          color: "#00000020",
        },
      },
    },
    hover: {
      mode: "nearest",
      axis: "x",
      intersect: true,
    },
    plugins: {
      tooltip: {
        mode: "nearest",
        axis: "x",
        intersect: true,
        callbacks: {
          label: (context) => {
            return context.dataset.label + ": " + context.raw.y;
          },
          labelColor: function (context) {
            return {
              backgroundColor: getColor(context.raw.y),
            };
          },
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: (speedStatData.length < 10) * 4,
        hitRadius: 4,
        hoverRadius: 6,
      },
    },
  };

  useEffect(() => {
    if (!avgSpeedStat[choosenDate] || !avgSpeedStat[choosenDate].length) {
      fetchData();
    }
    async function fetchData() {
      const result = await axios.get("/api/stat/get-rsou", {
        params: {
          d: choosenDate,
          username: user.username,
        },
      });
      if (result.status == 200 && result.data.status) {
        setAvgSpeedStat((old) => {
          const _new = new Array(...old);
          _new[choosenDate] = result.data.data;
          return _new;
        });
      } else {
        toast.error("OoOps SOmething went WrOng!");
      }
    }
  }, [choosenDate]);

  useEffect(() => {
    setTitle(user.fullName);
  }, []);

  if (user) {
    const {
      fullName,
      username,
      avatar,
      hst_speed = 0,
      avg_speed = 0,
      avglst_speed = 0,
      coffeeLove = 50,
      teaLove = 50,
      lvl = 0,
      best_lvl = 0,
      total_score = 0,
    } = user;

    return (
      <Page sideBar={false}>
        <div className="user-page">
          <div className="row">
            <div className="col-md-4 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <div
                  className={`avatar _${avatar} rounded-circle`}
                  width="150px"
                  style={{ width: 150, height: 150, marginBottom: "1rem" }}
                />
                <span className="font-weight-bold h4">{user.fullName}</span>
                <span className={`font-weight-bold ${Levels[lvl]}-lvl`}>
                  @{user.username}
                </span>
              </div>
              <div className="p-3 text-center">
                <div className="row">
                  <div className="col-md-12">
                    <small className="purple">Score</small>
                    <div className="row pt-2">
                      <div className="h2 purple">{total_score}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <small className="tea">Love of tea:</small>
                    <div className="row pt-2">
                      <div className="h4 tea">{teaLove} 💚</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <small className="coffee">Love of coffee:</small>
                    <div className="row pt-2">
                      <div className="h4 coffee">{coffeeLove} 🤎</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="p-3 pt-5">
                <div className="text-right">
                  <span className={`h4 ${Levels[lvl]}-lvl`}>
                    #{Levels[Levels[lvl]]} Racer
                  </span>{" "}
                  (
                  <span className={`h6 ${Levels[best_lvl]}-lvl`}>
                    {Levels[Levels[best_lvl]]}
                  </span>
                  .{" "}
                  <small>
                    highest speed:{" "}
                    <b>
                      {hst_speed} {unitOfSpeed[0]}
                    </b>
                  </small>
                  )
                </div>
              </div>
              <div className="p-3 ">
                <div className="row">
                  <div className="col-lg-4">
                    <small>Avg. last 10 races:</small>
                    <div className="row pt-2">
                      <div className="h2 red">
                        {calcSpeed(avglst_speed)}{" "}
                        <span className="h5">
                          <Tooltip text={unitOfSpeed[1]}>
                            {unitOfSpeed[0]}
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <small>Highest speed:</small>
                    <div className="row pt-2">
                      <div className="h2 red">
                        {calcSpeed(hst_speed)}{" "}
                        <span className="h5">
                          <Tooltip text={unitOfSpeed[1]}>
                            {unitOfSpeed[0]}
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <small>Avg. Speed:</small>
                    <div className="row pt-2">
                      <div className="h2 red">
                        {calcSpeed(avg_speed)}{" "}
                        <span className="h5">
                          <Tooltip text={unitOfSpeed[1]}>
                            {unitOfSpeed[0]}
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="float-end">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => {
                      setChoosenDate(parseInt(e.target.value));
                    }}
                    size="sm"
                    value={choosenDate}
                  >
                    <option value={0}>All time</option>
                    <option value={1}>Last Year</option>
                    <option value={2}>Last Month</option>
                    <option value={3}>Last week</option>
                    <option value={4}>Last 24 hours</option>
                    <option value={5}>Last 12 hours</option>
                    <option value={6}>Last 6 hours</option>
                  </Form.Select>
                </div>
                <div className="mb-1 me-3 float-end">
                  <small>Your average speed for the: </small>
                </div>
                <Line
                  data={{
                    datasets: [
                      {
                        label: "Speed",
                        backgroundColor: "#00000040",
                        borderColor: "#fff",
                        pointBackgroundColor: "#639",
                        borderWidth: 3,
                        fill: !!speedStatData.length,
                        data: speedStatData,
                      },
                    ],
                  }}
                  options={speedStatOptions}
                  plugins={[
                    levelsColoring(),
                    {
                      zoom: {
                        wheel: {
                          enabled: true,
                        },
                        pinch: {
                          enabled: true,
                        },
                        mode: "x",
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  } else {
    return <Loader />;
  }
}
