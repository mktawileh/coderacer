import colors from "../view/scss/levels.module.scss";

export const getColor = (avgSpeed) => {
  if (avgSpeed >= 150) {
    return colors["gm"];
  } else if (avgSpeed >= 109) {
    return colors["mst"];
  } else if (avgSpeed >= 83) {
    return colors["ex"];
  } else if (avgSpeed >= 61) {
    return colors["pro"];
  } else if (avgSpeed >= 40) {
    return colors["pup"];
  } else {
    return colors["nb"];
  }
};

export default {
  gm: "Grandmaster",
  mst: "Master",
  ex: "Expert",
  pro: "Pro",
  pup: "Pupil",
  nb: "Newbie",
  0: "nb",
  1: "pup",
  2: "pro",
  3: "ex",
  4: "mst",
  5: "gm",
};
