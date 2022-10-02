import React from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "../view/components/Link";

function RegisterPage({ userState }) {
  const [user, setUser] = userState;
  const router = useRouter();
  const navigate = router.push;

  function handleSubmit(e) {
    e.preventDefault();
    const { username, fullName, password, passwordConfirm } = e.target.elements;

    let isGood = true;
    if (username.value.length < 4) {
      toast.error(
        "Username is to short, should be greater or equal to eight characters"
      );
      username.classList.add("is-invalid");
      isGood = false;
    }

    if (password.value.length < 8) {
      toast.error(
        "Password is to short, should be greater or equal to eight characters"
      );
      password.classList.add("is-invalid");
      isGood = false;
    }
    if (passwordConfirm.value != password.value) {
      toast.error("Passwords don't match!");
      password.classList.add("is-invalid");
      passwordConfirm.classList.add("is-invalid");
      isGood = false;
    }
    if (isGood) {
      const data = {
        username: username.value,
        fullName: fullName.value,
        password: password.value,
      };

      axios
        .post("/api/auth/register", data)
        .then(function (res) {
          const { status, message, messages, user } = res.data;
          if (status) {
            toast.success(message);
            setUser(user);
            navigate("/avatar");
          } else {
            messages.map((msg) => {
              toast.error(msg);
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <h3>Register for free</h3>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            name="fullName"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username ( not less than four charactars 😉)"
            name="username"
          />
          <Form.Text className="text-muted">
            Choose an username that makes you look cool 😆.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>
            Please confirm your password to avoid any kind of typo 😬
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Password confirmation"
            name="passwordConfirm"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword"></Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>

        <Form.Group className="mt-3" controlId="formBasicPassword">
          <Form.Text className="text-muted">
            Already have an account? <Link to="/login">Login</Link>
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
}

export default RegisterPage;
