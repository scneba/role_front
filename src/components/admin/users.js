import React, { useState, useEffect, useCallback } from "react";
import { Accordion, Card, Button, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import * as alerts from "../generics/alerts";
import { useHistory } from "react-router-dom";

import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";
import Skeleton from "react-loading-skeleton";
import { FormErrors } from "../generics/forms";

const UserList = () => {
  const { t } = useTranslation(["admin"]);

  const canView = usePermissions(adminApi.USERS_PATH);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async function () {
    try {
      setLoading(true);
      const resp = await adminApi.getUsers();
      setUsers(resp.data.data);
    } catch (err) {
      console.log(err);
      alerts.showErrorsPopUp(err);
    }
    setLoading(false);
  });
  useEffect(() => {
    fetchUsers();
  }, []);

  if (!canView) {
    return <Unauthorized />;
  }
  if (loading) {
    return <Skeleton height={40} count="4" className="m-3" />;
  }

  return (
    <div>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon="user-tag" /> {t("users")}
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
  const canDeleteUser = usePermissions(adminApi.USERS_PATH, "DELETE");

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
  const deleteUser = async () => {
    let result = window.confirm(t("confirmUserDelete"));
    if (result === true) {
      try {
        adminApi.deleteUser(id);
        fetchUsers();
        alerts.showPopup(t("shared:success"));
      } catch (err) {
        console.log(err);
        alerts.showErrorsPopUp(err);
      }
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
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const canAddUser = usePermissions(adminApi.USERS_PATH, "POST");

  const addUser = async () => {
    try {
      setErrors([]);
      setSaving(true);
      await adminApi.createUser({ name, username, email, password });
      fetchUsers();
      alerts.showPopup(t("shared:success"), "success");
    } catch (err) {
      console.log(err);
      alerts.showErrors(err, setErrors);
    }
    setSaving(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
      <Form.Row>
        <Col xs={6} md={2}>
          <Form.Control
            required
            value={name}
            placeholder={t("name")}
            onChange={(e) => setName(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={2}>
          <Form.Control
            required
            value={username}
            placeholder={t("username")}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={2}>
          <Form.Control
            value={email}
            type="email"
            required
            placeholder={t("email")}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!canAddUser}
            title={!canAddUser ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={2}>
          <Form.Control
            value={password}
            type="password"
            required
            placeholder={t("password")}
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
            {saving ? t("shared:saving") : t("addUser")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export default UserList;
