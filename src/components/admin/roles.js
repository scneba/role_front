import React, { useState, useEffect, useCallback } from "react";
import { Accordion, Card, Button, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import * as alerts from "../generics/alerts";
import { useHistory } from "react-router-dom";

import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";

const RolesList = () => {
  const { t } = useTranslation(["admin"]);

  const canView = usePermissions(adminApi.PAGES_PATH);
  const [roles, setRoles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(null);

  const fetchRoles = useCallback(async function () {
    try {
      const resp = await adminApi.getRoles();
      setRoles(resp.data.data);
    } catch (err) {
      console.log(err);
      const message = JSON.stringify(err);
      alerts.showPopup(message);
    }
    setIsLoaded(true);
  });
  useEffect(() => {
    if (!isLoaded) fetchRoles();
    // eslint-disable-next-line
  }, [isLoaded]);

  if (!canView) {
    return <Unauthorized />;
  }
  if (!isLoaded) {
    return "Loading...";
  }

  return (
    <div>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon={faUserTag} /> {t("roles")}
      </h1>
      <AddRoleForm fetchRoles={fetchRoles} />
      <RoleTable roles={roles} fetchRoles={fetchRoles} />
    </div>
  );
};

const RoleTable = ({ roles, fetchRoles }) => {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredRoles, setFilteredRoles] = useState(roles);

  useEffect(() => {
    setFilteredRoles(
      roles.filter((role) =>
        role.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, roles]);

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
        {filteredRoles &&
          filteredRoles.map((role) => (
            <RoleCard role={role} key={role.id} fetchRoles={fetchRoles} />
          ))}
      </Accordion>
    </div>
  );
};
const RoleCard = ({ role, fetchRoles }) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={role.id}>
        {role.name}
        <FontAwesomeIcon className="ml-5" icon="angle-down"></FontAwesomeIcon>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={role.id}>
        <RoleDetails key={role.id} role={role} fetchRoles={fetchRoles} />
      </Accordion.Collapse>
    </Card>
  );
};

const RoleDetails = ({ role, fetchRoles }) => {
  const { id, permissions, users } = role;
  const { t } = useTranslation(["admin"]);
  const canDeleteRole = usePermissions(adminApi.PAGES_PATH, "POST");

  const history = useHistory();

  function onClick() {
    const link = `/admin/roles/${role.id}`;
    history.push(link);
  }
  return (
    <Card.Body>
      {users.map((user) => {
        return (
          <p variant="primary" key={user.email ? user.email : user.username}>
            <b>
              {user.email
                ? user.email.toUpperCase()
                : user.username.toUpperCase()}
              :
            </b>
          </p>
        );
      })}

      <p className="pb-4">
        <DeleteRole
          canDeleteRole={canDeleteRole}
          id={role.id}
          fetchRoles={fetchRoles}
        />
        <Button
          variant="primary"
          className="mr-2 p-2 pull-right"
          onClick={onClick}
        >
          {t("permissions")}
        </Button>
      </p>
    </Card.Body>
  );
};

function DeleteRole({ id, canDeleteRole, fetchRoles }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteRole = () => {
    let result = window.confirm(t("confirmRoleDelete"));
    if (result === true) {
      adminApi
        .deleteRole(id)
        .then((response) => {
          fetchRoles();
          alert(t("shared:success"));
        })
        .catch((e) => {
          console.error(e);
          alert(t("shared:internalError"));
        });
    }
  };

  return (
    <Button
      variant="danger"
      className="mr-2 p-2 pull-right"
      onClick={deleteRole}
      disabled={!canDeleteRole}
      title={!canDeleteRole ? t("noDeletePermission") : null}
    >
      <FontAwesomeIcon icon="trash-alt" className="mr-2"></FontAwesomeIcon>
      {t("shared:delete")}
    </Button>
  );
}

export function AddRoleForm({ fetchRoles }) {
  const { t } = useTranslation(["admin"]);
  const [name, setName] = useState("");
  const [description, setDescriptiion] = useState("");

  const canAddRole = usePermissions(adminApi.PAGES_PATH, "POST");

  const addRole = async () => {
    try {
      await adminApi.createRole({ name, description });
      fetchRoles();
      alerts.showPopup(t("shared:success"), "success");
    } catch (error) {
      const message = JSON.stringify(error);
      alerts.showPopup(message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRole(name, description);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Row>
        <Col xs={6} md={3}>
          <Form.Control
            required
            value={name}
            placeholder={t("newRoleName")}
            onChange={(e) => setName(e.target.value)}
            disabled={!canAddRole}
            title={!canAddRole ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col xs={6} md={3}>
          <Form.Control
            value={description}
            placeholder={t("newRoleDescription")}
            onChange={(e) => setDescriptiion(e.target.value)}
            disabled={!canAddRole}
            title={!canAddRole ? t("noPermission") : null}
            className="p-1"
          />
        </Col>
        <Col>
          <Button
            disabled={!canAddRole}
            type="submit"
            variant="danger"
            className="text-white px-3 ml-3"
            title={!canAddRole ? t("noPermission") : null}
          >
            <FontAwesomeIcon icon="plus" className="mr-2"></FontAwesomeIcon>
            {t("shared:add")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export default RolesList;
