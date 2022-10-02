import { stopConfetti } from "../../utils/confetti";

export default function ({ start }) {
  return (
    <canvas
      id="confetti-canvas"
      style={{
        display: "block",
        zIndex: 999999,
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      width="1301"
      height="960"
    />
  );
}
