import { useState, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default ({ onSumbit, showState }) => {
  const [showPasswordModal, setShowPasswordModal] = showState;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const submitButton = useRef(null);

  const handleConfirmButton = () => {
    if (submitButton && submitButton.current) {
      submitButton.current.click();
    }
  };

  return (
    <Modal
      show={showPasswordModal}
      onHide={() => setShowPasswordModal(false)}
      size="lg"
      backdrop="static"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (typeof onSumbit == "function") onSumbit(e);
          setShowConfirmPassword(false);
          setShowPasswordModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change your password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current Password"
                name="currentPassword"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Create a new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter a new password"
                name="password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Confirm your password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password again"
                name="confirmPassword"
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => setShowConfirmPassword(true)}
          >
            Save
          </Button>
          <button hidden type="submit" ref={submitButton}></button>
        </Modal.Footer>
        <Modal
          show={showConfirmPassword}
          onHide={() => {
            setShowConfirmPassword(false);
          }}
          size="sm"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title className="h6">
              Are you sure you want to change your password
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              variant="dark"
              size="sm"
              onClick={() => {
                setShowConfirmPassword(false);
              }}
            >
              Discard
            </Button>

            <Button variant="success" size="sm" onClick={handleConfirmButton}>
              Yes 😌
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Modal>
  );
};
