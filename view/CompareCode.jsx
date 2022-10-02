import Prism from "prismjs";

export default function CompareCode({
  userCode = "",
  code = "",
  owner = false,
}) {
  return (
    <div className="row">
      <div className="col-lg-6">
        <h6>Original Code: </h6>
        <pre
          className="language-cpp racing-code"
          id="prevRef"
          style={{
            paddingTop: 50 + "px",
            paddingBottom: 50 + "px",
            fontSize: 1.2 + "rem",
          }}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(code, Prism.languages.cpp) + "</br>",
          }}
        ></pre>
      </div>
      <div className="col-lg-6">
        <h6>{owner ? "Your typing:" : "Racer typing:"}</h6>
        <pre
          className="language-cpp racing-code"
          id="prevRef"
          style={{
            paddingTop: 50 + "px",
            paddingBottom: 50 + "px",
            fontSize: 1.2 + "rem",
          }}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(userCode, Prism.languages.cpp) + "</br>",
          }}
        ></pre>
      </div>
    </div>
  );
}
