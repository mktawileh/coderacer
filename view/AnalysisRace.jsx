import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Modal, Button } from "react-bootstrap";
import Prism from "prismjs";
import Tooltip from "./components/Tooltip";
import moment from "moment";

import { getUnit, calcSpeed } from "../utils/speed";

function AnalysisRace({
  show = false,
  code,
  value = "",
  acc,
  cwpm,
  beauty,
  score,
  mistakes = {},
  spd = [],
  time,
  owner = false,
  noRacerCode = false,
}) {
  if (!show) return "";
  const [viewRacerCode, setViewRacerCode] = useState(false);
  const speedUnit = getUnit();

  const mistakesChartData = {
    labels: Object.keys(mistakes),
    datasets: [
      {
        label: "Frequency of mistake",
        backgroundColor: "#663399",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: Object.values(mistakes),
      },
    ],
  };
  const spdChartData = {
    labels: new Array(code.value.split("\n").length - 1)
      .fill(0)
      .map((e, i) => "Line " + (i + 1)),
    datasets: [
      {
        fill: true,
        label: "speed",
        backgroundColor: "#66339991",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: spd.map((e) => calcSpeed(e)),
      },
    ],
  };

  return (
    <div className="section p-3">
      <div className="row">
        {!noRacerCode ? (
          <div className="pe-3 ps-3">
            <button
              className="btn-primary btn"
              onClick={() => setViewRacerCode(true)}
            >
              {owner ? "View your typing :)" : "View racer typing"}
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="p-3 ">
          <div className="row">
            <div className="col-md-3">
              Speed:
              <div className="row pt-2">
                <div className="h2 red">
                  {calcSpeed(cwpm)}{" "}
                  <Tooltip text={speedUnit[1]}>{speedUnit[0]}</Tooltip>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              Accurecy:
              <div className="row pt-2">
                <div className="h2 red">{acc}%</div>
              </div>
            </div>
            <div className="col-md-3">
              Code beauty:
              <div className="row pt-2">
                <div className="h2 red">{beauty}%</div>
              </div>
            </div>
            <div className="col-md-3">
              Score:
              <div className="row pt-2">
                <div className="h2 red">{score}+</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 p-3">
            <div className="row">
              <div className="col-md-7 col-lg-12">
                {acc == 100 ? (
                  <div className="py-5 text-center message mb-3 align-items-center">
                    {owner ? (
                      <>
                        <b>Awesome!</b> 😃 You finished the race with <b>0</b>{" "}
                        mistake
                      </>
                    ) : (
                      <>
                        Racer finished the race with <b>0</b> mistake 😃
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {owner ? (
                      <h5>Your mistakes during the race</h5>
                    ) : (
                      <h5>Racer mistakes during the race</h5>
                    )}
                    <Bar
                      data={mistakesChartData}
                      options={{
                        indexAxis: "x",
                        aspectRatio: 2,
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            suggestedMax: 4,
                          },
                        },
                      }}
                    />
                  </>
                )}
              </div>
              <div className="col-md-5 col-lg-12">
                <div className="message dark align-items-center">
                  {owner ? (
                    <h6>You finished the race within: </h6>
                  ) : (
                    <h6>Racer finished the race within: </h6>
                  )}
                  <div className="text-center">
                    <span className="text-center timer-box">
                      {moment(time * 1000).format("mm:ss")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 p-3">
            {owner ? (
              <h5>Your speed during the race</h5>
            ) : (
              <h5>Racer speed during the race</h5>
            )}
            <Line
              data={spdChartData}
              options={{
                responsive: true,
                aspectRatio: 2,
                scales: {
                  y: {
                    beginAtZero: true,
                    suggestedMax: 200,
                  },
                },
              }}
            />
          </div>
        </div>
        <Modal
          show={viewRacerCode}
          backdrop="static"
          onHide={() => setViewRacerCode(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="h6"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre
              className="language-cpp racing-code"
              id="prevRef"
              style={{
                paddingTop: 50 + "px",
                paddingBottom: 50 + "px",
                fontSize: 1.2 + "rem",
              }}
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(value, Prism.languages.cpp) + "</br>",
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="dark"
              onClick={() => setViewRacerCode(false)}
              size="sm"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AnalysisRace;
