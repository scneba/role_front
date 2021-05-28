import React, { useContext } from "react";
import { UserContext } from "./login/userContext";
import { Row } from "react-bootstrap";

// usePermissions hook determines if a user has permissions to access path/verb pair
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
  return (
    <Row>
      <h1 className=" text-primary">
        Sorry, you do not have permission to access this page
      </h1>
    </Row>
  );
}
