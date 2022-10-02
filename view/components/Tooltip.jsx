export default function Tooltip({ text = "", children }) {
  return (
    <div className="cd-tooltip-overlay">
      <span className="cd-tooltip-content">{children}</span>
      <div className="cd-tooltip-text">{text}</div>
    </div>
  );
}
