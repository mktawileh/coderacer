import React, { useEffect, useState } from "react";
import { Row, Container, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/router";

const avatars = [
  ["a", "b", "c", "d"],
  ["e", "f", "g", "h"],
  ["i", "j", "k", "l"],
  ["m", "n", "o", "p"],
  ["q", "r", "s", "t"],
];

function AvatarPage({ userState }) {
  const [user, setUser] = userState;
  const router = useRouter();
  const navigate = router.push;

  const [avatar, setAvatar] = useState(user.avatar);

  function handleAvatarChange(event) {
    const { target } = event;
    setAvatar(target.dataset.value);
  }

  async function handleSaveButton() {
    await axios.post("/api/set-avatar", {
      avatar: avatar,
    });
    setUser((u) => {
      const newUser = Object.assign({}, u);
      newUser.avatar = avatar;
      return newUser;
    });
    navigate("/user/" + user.username);
  }

  return (
    <div className="avatar-page">
      <Container>
        <div className="row p-3 justify-content-between align-items-center">
          <div className="col-md-6">
            <h4 className="text-center header">
              Choose an avatar for your profile 😊
            </h4>
          </div>
          <div className="col-md-6">
            <div className="text-center">
              <Button size="lg" onClick={handleSaveButton}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {avatars.map((row, k) => (
          <Row key={k}>
            {row.map((avtr, key) => (
              <Col key={key} className="avatar-wrapper">
                <div
                  className={
                    "avatar-box _" + avtr + (avtr == avatar ? " active" : "")
                  }
                  onClick={handleAvatarChange}
                  data-value={avtr}
                ></div>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </div>
  );
}

export default AvatarPage;
