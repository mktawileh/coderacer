const Loader = ({ fit = false, size = "lg" }) => {
  let sizeClass = "lg";
  if (size == "sm") sizeClass = "sm";

  return (
    <div id="loader" className={`main-loader${fit ? " fit" : ""} ${sizeClass}`}>
      <div className="loader-container">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
