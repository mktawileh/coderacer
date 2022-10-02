import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "../view/components/Link.jsx";

export default function LoginPage({ userState }) {
  const router = useRouter();
  const navigate = router.push;
  const [user, setUser] = userState;
  const [loading, setloading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const { username, password } = e.target.elements;
    const data = { username: username.value, password: password.value };
    setloading(true);
    axios
      .post("/api/auth/login", data)
      .then(function (res) {
        const { status, message, user } = res.data;
        if (status) {
          toast.success(message);
          setUser(user);
          navigate("/");
        } else {
          toast.error(message);
          password.classList.add("is-invalid");
        }
        setloading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="page-wrapper">
      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <h3>Login to your account</h3>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username "
              name="username"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formBasicPassword"
          ></Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "loading..." : "Login"}
          </Button>

          <Form.Group className="mt-3" controlId="formBasicPassword">
            <Form.Text className="text-muted">
              Don't have an account? <Link to="/register">Register</Link>
            </Form.Text>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
