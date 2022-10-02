import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import { toast } from "react-toastify";

const { highlight: hl, languages: langs } = Prism;

function CodeModal(props) {
  const { data = {}, show, onClose = null, onSave = null, setShow } = props;

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setCode(data.value || "");
    setTitle(data.title || "");
  }, [data]);

  const handleClose = (e) => {
    if (typeof onClose == "function") onClose();
  };

  const handleEdit = (e) => {
    setCode(data.value);
    setTitle(data.title);
    setShow([true, true]);
  };

  const handleDiscard = () => {
    setConfirm(false);
    setShow([true, false]);
  };

  const handleSave = async () => {
    if (!code) {
      toast.error("You can't leave code empty :(");
      return;
    }
    const result = await axios.post("/api/code/update", {
      data: code,
      title,
      id: data._id,
    });
    if (result.status == 200 && result.data.status) {
      toast.success(result.data.message);
      result.data.data.index = data.index;
      if (onSave) onSave(data.index, result.data.data);
      setConfirm(false);
      if (typeof onClose == "function") onClose();
    } else {
      toast.error(result.data.message);
    }
  };

  const edit = show[1];

  return (
    <div>
      <Modal
        show={show[0]}
        onHide={() => setShow([false, false])}
        onExited={handleClose}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {edit ? (
              <>
                <label className="labels">Title: </label>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Title"
                  placeholder={`defulat will be "Code #Index"`}
                  value={title}
                  tabIndex={1}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              data.title
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {edit ? (
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
          ) : (
            <pre
              className="language-cpp"
              dangerouslySetInnerHTML={{
                __html: hl(data.value || "", langs.cpp),
              }}
            ></pre>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow([false, false])}>
            Close
          </Button>
          {!edit ? (
            <Button variant="primary" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button variant="success" onClick={() => setConfirm(true)}>
                Save Changes
              </Button>
              <Modal show={confirm} size="sm" backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title className="h6">
                    Are you sure you want to save the changes
                  </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <Button variant="dark" size="sm" onClick={handleDiscard}>
                    Discard
                  </Button>
                  <Button variant="success" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CodeModal;
