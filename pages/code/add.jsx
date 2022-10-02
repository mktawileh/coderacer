import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import Link from "../../view/components/Link";

function AddCodePage() {
  const navigate = useRouter().push;
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(e) {
    if (!code) {
      toast.error("You need to write some code first :)");
      return;
    }

    const result = await axios.post("/api/code/add", { data: code, title });
    if (result.status == 200 && result.data.status) {
      toast.success(result.data.message);
      navigate("/code");
    } else {
      toast.error(result.data.message);
    }
  }
  return (
    <div className="container">
      <div
        className="rounded bg-white mt-5 mb-5 container"
        style={{ position: "relative" }}
      >
        <div className="row justify-content-center align-items-center p-3 py-5">
          <div className="col">
            <h3 className="col mx-3">Add a new code</h3>
          </div>
          <div className="col title m-3">
            <label className="labels">Enter a little title</label>
            <input
              type="text"
              className="form-control"
              aria-label="Title"
              placeholder={`defulat will be "Code #Index"`}
              value={title}
              tabIndex={1}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{ position: "absolute", top: 0, right: 0 }}
          className="mx-3 mt-3"
        >
          <button onClick={handleSubmit} className="btn btn-primary me-3">
            Save
          </button>
          <Link to="/code">
            <button className="btn btn-danger ">Cancel</button>
          </Link>
        </div>
        <div className="row">
          <Editor
            preClassName="language-cpp"
            className="editor"
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => Prism.highlight(code, Prism.languages.cpp)}
            padding={10}
            tabSize={4}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              minHeight: 300,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddCodePage;
