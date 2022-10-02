import { useState, useEffect } from "react";
import moment from "moment";

export default function Countdown({ date, seconds = 120, freeze = false }) {
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState(null);
  useEffect(() => {
    if (!date || freeze) return;
    let counter = new Date(date).getTime() + seconds * 1000 - Date.now();
    const intervalId = setInterval(
      (function tick() {
        setCurrent(counter);
        if (counter < 1000) {
          clearInterval(id);
          return;
        }
        counter -= 1000;
        return tick;
      })(),
      1000
    );

    setId(intervalId);
  }, [date]);

  useEffect(() => {
    if (freeze) {
      clearInterval(id);
    }
  }, [freeze]);
  if (date) {
    return <span>{moment(current).format("mm:ss")}</span>;
  } else return <span>00:00</span>;
}
