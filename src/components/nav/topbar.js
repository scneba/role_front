import { useContext } from "react";
import { Navbar, NavDropdown, NavItem, Nav, Dropdown } from "react-bootstrap";
import { UserContext } from "../login/userContext";
import logo from "../../logo.svg";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import { logout } from "../../services/auth";

/**
 * Static Nav bar at the top of the view
 * @param {*} param0
 * @returns
 */
export default function TopNav({ setUser }) {
  const { t } = useTranslation(["nav"]);
  const user = useContext(UserContext);
  return (
    <Navbar expand="lg" sticky="top" bg="primary" variant="dark">
      <Navbar.Brand as={Link} to="/">
        <Brand>Endesha</Brand>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="endesha-nav" />
      <Navbar.Collapse id="endesha-nav">
        <Nav className="mx-auto my-3">
          <NavDropdown
            title={t("high_way_code")}
            id="collasible-nav-dropdown"
            className="mx-4"
          >
            <NavDropdown.Item as={Link} to="/test/1">
              {t("questions_and_answers")}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/test/1">
              {t("take_test")}
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title={t("road_signs")}
            id="collasible-nav-dropdown"
            className="mx-4"
          >
            <NavDropdown.Item as={Link} to="/test/1">
              {t("questions_and_answers")}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/test/2">
              {t("take_test")}
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title={t("mtb")}
            id="collasible-nav-dropdown"
            className="mx-4"
          >
            <NavDropdown.Item as={Link} to="/test/1">
              {t("questions_and_answers")}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/test/1">
              {t("take_test")}
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title={t("driving_practice")}
            id="collasible-nav-dropdown"
            className="mx-4"
          >
            <NavDropdown.Item as={Link} to="/test/1">
              {t("questions_and_answers")}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/test/1">
              {t("take_test")}
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          {user && user.email ? (
            <Dropdown as={NavItem}>
              <Dropdown.Toggle as={Nav.Link}>{user.email}</Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-right">
                <Dropdown.Item>
                  <LogoutButton setUser={setUser} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link as={Link} to="/login">
              Log in
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function Brand({ children }) {
  return (
    <div>
      <img
        alt="PG"
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
      {children}
    </div>
  );
}

function LogoutButton({ setUser }) {
  const history = useHistory();
  const { t } = useTranslation(["nav"]);
  async function logoutAmini() {
    await logout();
    setUser(null);
    history.push("/login");
  }

  return <div onClick={logoutAmini}>{t("logout")}</div>;
}
