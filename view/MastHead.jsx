import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import Link from "./components/Link";
import NavLink from "./components/NavLink";
import Levels from "../utils/levels";
import { calcSpeed, getUnit } from "../utils/speed";
const adminLinks = (role) => {
  if (role == "admin")
    return (
      <>
        <NavLink to="/code">Codes</NavLink>
      </>
    );
};
const authLinks = (auth) => {
  if (auth) {
    return (
      <>
        <NavLink to="/race/with-friends">Race with your friends</NavLink>
      </>
    );
  }
};

function MastHead({ userState, onLogout }) {
  const [user, setUser] = userState;

  return (
    <div className="masthead">
      <Navbar bg="light" expand="lg">
        <Container>
          <div className="navbar-brand">
            <span className="purple bold">Code</span>Racer
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/race">Practice</NavLink>

              {authLinks(!!user.username)}
              {adminLinks(user.role)}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse
            className="justify-content-end"
            style={{ display: "flex" }}
          >
            {!!user.username ? (
              <>
                <Navbar.Text className="me-3">
                  Avg. speed:{" "}
                  <b className={Levels[user.lvl] + "-lvl"}>
                    {calcSpeed(user.avglst_speed)}
                  </b>{" "}
                  {getUnit()[0]}
                </Navbar.Text>
                <div
                  className={"avatar _" + user.avatar}
                  style={{ marginLeft: "1rem", marginRight: "1rem" }}
                ></div>
                <NavDropdown
                  title={user.username}
                  className={`username ${Levels[user.lvl]}-lvl`}
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <Link to={"/user/" + user.username} className="clean">
                    <NavDropdown.Item as="button">Profile</NavDropdown.Item>
                  </Link>
                  <Link to={"/profile/edit"} className="clean">
                    <NavDropdown.Item as="button">
                      Edit your profile
                    </NavDropdown.Item>
                  </Link>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary nav-button">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary nav-button">
                  Register
                </Link>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default MastHead;
