export function calcSpeed(number) {
  const u = localStorage.getItem("speed");

  if (u == "wpm") return parseInt(number / 1.8);
  else return number;
}

export function getUnit() {
  const u = localStorage.getItem("speed");

  if (u == "wpm") return ["wpm", "Word per minute"];
  else return ["cwpm", "Code word per minute"];
}
