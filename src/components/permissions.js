import React, { useContext } from "react";
import { UserContext } from "./login/userContext";
import { Row, Button, Col } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

/**
 * Determine if a user has permission to access a path and a verb
 * @param {String} path
 * @param {String} verb
 * @returns bool
 */
export function usePermissions(path, verb) {
  verb = verb || "GET";
  const user = useContext(UserContext);
  if (!user) return false;
  const permissions = [];
  for (let role of user.roles) {
    permissions.push(...role.permissions);
  }

  if (permissions.length === 0) return false;
  //get all permissions having the path
  let pathPermissions = permissions.filter((p) => p.path === path);
  //get all the verbs into an array
  let verbs = pathPermissions.map((perm) => perm.verb);
  //return true if verb exists
  return verbs.includes(verb);
}

export function Unauthorized() {
  const currentLocation = useLocation();
  const user = useContext(UserContext);
  const history = useHistory();
  const redirectURL = "/login?redirect=" + currentLocation.pathname;

  function redirect() {
    history.push(redirectURL);
  }
  return (
    <Row>
      <Col>
        <h1 className=" text-primary">
          Sorry, you do not have permission to access this page
        </h1>
      </Col>
      {user ? (
        <br />
      ) : (
        <Col>
          <Button variant="danger" onClick={redirect}>
            Login
          </Button>
        </Col>
      )}
    </Row>
  );
}
