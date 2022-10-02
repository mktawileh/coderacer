import React, { useState, useEffect } from "react";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";

function makeWords(code) {
  const tokens = Prism.tokenize(code, Prism.languages.cpp);
  let words = [];
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] == "object") {
      words.push(tokens[i].content.trim());
    }
    if (typeof tokens[i] == "string" && tokens[i].trim()) {
      if (tokens[i].trim().indexOf(" ") > -1) {
        words.push(...tokens[i].trim().split(" "));
      } else {
        words.push(tokens[i].trim());
      }
    }
  }
  return words;
}

const lower_bound = (arr, item) => {
  let l = 0,
    r = arr.length,
    res = -1;
  while (l <= r) {
    const m = Math.ceil((l + r) / 2);

    if (arr[m] <= item) {
      l = m + 1;
      res = m;
    } else r = m - 1;
  }
  return res;
};

export default function RaceInput(props) {
  const {
    code = {},
    onStart,
    onValueChange,
    onNewLine,
    onCorrectWord,
    onNewRace,
    onError,
    done = false,
    waiting = false,
    lastProgress = { progress: 0, value: "" },
  } = props;

  const [value, setValue] = useState("");
  const [fixed, setFixed] = useState("");
  const [line, setLine] = useState(0);
  const [required, setRequired] = useState("");
  const [linesIndexes, setLinesIndexes] = useState([]); // indexes of lines
  const [indices, setIndices] = useState([0]);
  const [statePos, setStatePos] = useState([0, 0, 0]); // default [-1, 0, 0]
  const [error, setError] = useState(false); // default false
  const [words, setWords] = useState([]); // default []
  const [timer, setTimer] = useState(0); // default 0
  const [started, setStarted] = useState(false); // default false
  const [willStart, setWillStart] = useState(false); // default false
  const [progress, setProgress] = useState(0);

  const handleError = () => {
    if (!error) {
      const pr = code.value.split("\n");
      const word = pr[line].substr(statePos[0], statePos[2]);
      if (typeof onError == "function") onError({ word });
    }
    setError(true);
  };

  const handleWin = () => {
    setStarted(false);
    setWillStart(false);
    setValue("");
    setFixed("");
    setLine(0);
    setRequired("");
    setLinesIndexes([]);
    setIndices([0]);
    setStatePos([0, 0, 0]);
    setError(false);
    setWords([]);
    setProgress(0);
  };

  const start = () => {
    let seconds = new Date(code.startAt).getTime() - Date.now();
    setWillStart(true);
    let counter = setInterval(
      (function tick() {
        if (seconds < 1000) {
          setTimer(0);
          clearInterval(counter);
          return;
        }
        setTimer(parseInt(seconds / 1000));
        if (seconds != 0) seconds -= 1000;
        return tick;
      })(),
      1000
    );

    setTimeout(() => {
      setStarted(true);
    }, seconds);
  };

  if (code.value) {
    code.value = code.value
      .trim()
      .split("\n")
      .filter((e) => e.trim())
      .join("\n");
  } else {
    code.value = "";
  }

  useEffect(() => {
    if (!lastProgress || !lastProgress.progress) return;
    setProgress(lastProgress.progress);
    setFixed(lastProgress.value);
  }, [lastProgress]);

  useEffect(() => {
    const pr = document.getElementById("prevRef");
    if (!pr) return;
    let req = "",
      indx = [];

    for (let i = 0; i < pr.childNodes.length; i++) {
      const prChild = pr.childNodes[i];
      const bl = prChild.textContent.indexOf("\n");

      if (bl === 0) {
        indx.push(req.length);
      }
      if (!!prChild.textContent.trim()) {
        req += prChild.textContent.trim() + " ";
      }
      if (bl > 0) {
        indx.push(req.length);
      }
    }
    req = code.words.join(" ");
    setLinesIndexes(indx);
    setRequired(req);
    let br = [0];
    for (let i = 0; i < pr.textContent.length; i++) {
      if (pr.textContent[i] == "\n") br.push(i + 1);
    }

    let text = pr.textContent,
      ids = new Array();

    let arr = code.words,
      currentSlice = 0,
      f = 0;

    for (let i = 0; i < arr.length; i++) {
      let idx = text.slice(currentSlice).indexOf(arr[i]) + currentSlice;
      ids.push(idx);
      currentSlice = arr[i].length + ids[ids.length - 1];
    }
    for (let i = 0; i < arr.length; i++) {
      if (ids[i] >= br[f + 1]) f++;
      ids[i] -= br[f];
    }

    setIndices(ids);
    setWords(arr);

    let currentTyping = makeWords(fixed).join(" ");

    let c = currentTyping.length;
    setLine(lower_bound(indx, c) + 1);
    setStatePos([ids[progress], 0, arr[progress] ? arr[progress].length : 0]);
  }, [code]);
  useEffect(() => {
    if (started && document.querySelector("#codeRefInput"))
      document.querySelector("#codeRefInput").focus();
    if (started && typeof onStart == "function") {
      onStart();
    }
  }, [started]);

  useEffect(() => {
    if (code.value) start();
  }, [code]);

  useEffect(() => {
    if (done) {
      handleWin();
    }
  }, [done]);

  const handleTextAreaChange = (v) => {
    if (!started) return;
    let fixedPart = v.slice(0, fixed.length);
    if (fixed != fixedPart && v != "") return;
    if (v == "") {
      setValue(v);
      return;
    }
    let val = v.slice(fixed.length);
    setValue(val);

    if (done) return;
    let currentTyping = makeWords(v).join(" ");

    let c = currentTyping.length;

    if (c != 0 && required.slice(0, c).trim() != currentTyping.trim()) {
      handleError();
    } else {
      setError(false);
      const curLine = lower_bound(linesIndexes, c + 1) + 1;
      if (val.trim() == words[progress]) {
        if (typeof onCorrectWord == "function") onCorrectWord({ value: val });
        if (curLine != line && typeof onNewLine == "function") {
          onNewLine({ line });
        }
        setProgress((e) => e + 1);
        setFixed(fixed + val);
        setValue("");
        setStatePos([
          indices[progress + 1],
          0,
          words[progress + 1] ? words[progress + 1].length : 0,
        ]);
      }

      if (curLine != line) {
        setLine(curLine);
      }

      if (typeof onValueChange == "function") onValueChange({ value });
    }
  };

  return (
    <div>
      <div className="view-area">
        {!started ? (
          <div className={`overlay-control ${!started ? "show" : ""}`}>
            {timer ? (
              <div className="timer">
                <span className="value">{timer} seconds</span>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {code.value && !done ? (
          <div className={`code-container`}>
            <pre
              className="language-cpp racing-code"
              id="prevRef"
              style={{
                marginTop: (done ? 0 : -(line + 1) * 50) + "px",
                paddingTop: done ? 1 + "em" : 50 + "px",
                paddingBottom: done ? 1 + "em" : 50 + "px",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  Prism.highlight(code.value, Prism.languages.cpp) + "</br>",
              }}
            />
            <span
              className={`state ${error ? " error" : " "}`}
              style={{
                left: statePos[0] + 2 + "em",
                top: statePos[1] + "em",
                width: statePos[2] + "em",
              }}
            ></span>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className={`code-racer-container${!willStart ? " small" : ""}`}>
        {!willStart ? (
          <div className="editor-control">
            {waiting ? (
              <div className="waiting">Waiting for opponents...</div>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                tabIndex={2}
                onClick={() => {
                  if (typeof onNewRace == "function" && !waiting) onNewRace();
                }}
                disabled={waiting}
              >
                New Race
              </button>
            )}
          </div>
        ) : (
          <Editor
            preClassName="language-cpp"
            className="code-racer"
            value={fixed + value}
            onValueChange={handleTextAreaChange}
            highlight={(e) =>
              Prism.highlight(fixed + value, Prism.languages.cpp)
            }
            padding={10}
            tabSize={4}
            id={"codeRef"}
            tabIndex={1}
            textareaId={"codeRefInput"}
            // onPaste={(e) => e.preventDefault()}

            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 11,
            }}
          />
        )}
      </div>
    </div>
  );
}
