import React, { useState, useEffect, useCallback } from "react";
import { Accordion, Card, Button, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import * as alerts from "../generics/alerts";
import { useHistory } from "react-router-dom";

import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";

const UserList = () => {
  const { t } = useTranslation(["admin"]);

  const canView = usePermissions(adminApi.PAGES_PATH);
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(null);

  const fetchUsers = useCallback(async function () {
    try {
      const resp = await adminApi.getUsers();
      setUsers(resp.data.data);
    } catch (err) {
      console.log(err);
      const message = JSON.stringify(err);
      alerts.showPopup(message);
    }
    setIsLoaded(true);
  });
  useEffect(() => {
    if (!isLoaded) fetchUsers();
    // eslint-disable-next-line
  }, [t]);

  if (!canView) {
    return <Unauthorized />;
  }
  if (!isLoaded) {
    return "Loading...";
  }

  return (
    <div>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon="user_tag" /> {t("users")}
      </h1>
      <AddUserForm fetchUsers={fetchUsers} />
      <UserTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
};

const UserTable = ({ users, fetchUsers }) => {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, users]);

  return (
    <div>
      <Row>
        <Col lg={7}>
          <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              name="Search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search")}
            ></Form.Control>
          </Form>
        </Col>
      </Row>
      <Accordion>
        {filteredUsers &&
          filteredUsers.map((user) => (
            <UserCard user={user} key={user.id} fetchUsers={fetchUsers} />
          ))}
      </Accordion>
    </div>
  );
};
const UserCard = ({ user, fetchUsers }) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={user.id}>
        {user.email}
        <FontAwesomeIcon className="ml-5" icon="angle-down"></FontAwesomeIcon>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={user.id}>
        <UserDetails key={user.id} user={user} fetchUsers={fetchUsers} />
      </Accordion.Collapse>
    </Card>
  );
};

const UserDetails = ({ user, fetchUsers }) => {
  const { t } = useTranslation(["admin"]);
  const canDeleteUser = usePermissions(adminApi.PAGES_PATH, "POST");

  const history = useHistory();

  function onClick() {
    const link = `/admin/users/${user.id}`;
    history.push(link);
  }
  return (
    <Card.Body>
      {user.roles.map((role) => {
        return (
          <p variant="primary" key={role.name}>
            <b>{role.name}</b>
          </p>
        );
      })}

      <p className="pb-4">
        <DeleteUser
          canDeleteUser={canDeleteUser}
          id={user.id}
          fetchUsers={fetchUsers}
        />
        <Button
          variant="primary"
          className="mr-2 p-2 pull-right"
          onClick={onClick}
        >
          {t("roles")}
        </Button>
      </p>
    </Card.Body>
  );
};

function DeleteUser({ id, canDeleteUser, fetchUsers }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteUser = () => {
    let result = window.confirm(t("confirmRoleDelete"));
    if (result === true) {
      adminApi
        .deleteUser(id)
        .then((response) => {
          fetchUsers();
          alert(t("shared:success"));
        })
        .catch((err) => {
          console.log(err);
          const message = JSON.stringify(err);
          alerts.showPopup(message);
        });
    }
  };

  return (
    <Button
      variant="danger"
      className="mr-2 p-2 pull-right"
      onClick={deleteUser}
      disabled={!canDeleteUser}
      title={!canDeleteUser ? t("noDeletePermission") : null}
    >
      <FontAwesomeIcon icon="trash-alt" className="mr-2"></FontAwesomeIcon>
      {t("shared:delete")}
    </Button>
  );
}

export function AddUserForm({ fetchUsers }) {
  const { t } = useTranslation(["admin"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canAddUser = usePermissions(adminApi.PAGES_PATH, "POST");

  const addUser = async () => {
    try {
      await adminApi.createUser({ name, username, email, password });
      fetchUsers();
      alerts.showPopup(t("shared:success"), "success");
    } catch (error) {
      const message = JSON.stringify(error);
      alerts.showPopup(message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Row>
        <Col xs={6} md={3}>
          <Form.Control
            required
            value={name}
            placeholder={t("newUserEmail")}
            onChange={(e) => setName(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={3}>
          <Form.Control
            required
            value={username}
            placeholder={t("newUserName")}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={3}>
          <Form.Control
            value={email}
            type="email"
            required
            placeholder={t("newUserEmail")}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={3}>
          <Form.Control
            value={password}
            type="password"
            required
            placeholder={t("newUserPassword")}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col>
          <Button
            disabled={!canAddUser}
            type="submit"
            variant="danger"
            className="text-white px-3 ml-3"
            title={!canAddUser ? t("noPermission") : null}
          >
            <FontAwesomeIcon icon="plus" className="mr-2"></FontAwesomeIcon>
            {t("shared:add")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export default UserList;
