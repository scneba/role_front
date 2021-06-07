import React, { useState, useEffect, useCallback } from "react";
import { Accordion, Card, Button, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import * as alerts from "../generics/alerts";
import { useHistory } from "react-router-dom";
import { FormErrors } from "../generics/forms";

import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";
import Skeleton from "react-loading-skeleton";

const RolesList = () => {
  const { t } = useTranslation(["admin"]);

  const canView = usePermissions(adminApi.ROLES_PATH);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async function () {
    try {
      setLoading(true);
      const resp = await adminApi.getRoles();
      setRoles(resp.data.data);
    } catch (err) {
      console.log(err);
      alerts.showErrorsPopUp(err);
    }
    setLoading(false);
  });
  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
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
        <FontAwesomeIcon icon="user-tag" /> {t("roles")}
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
  const { users } = role;
  const { t } = useTranslation(["admin"]);

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
            <b>{user.email.toUpperCase()}</b>
          </p>
        );
      })}

      <p className="pb-4">
        <DeleteRole id={role.id} fetchRoles={fetchRoles} />
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

function DeleteRole({ id, fetchRoles }) {
  const { t } = useTranslation(["admin", "shared"]);
  const canDeleteRole = usePermissions(adminApi.ROLES_PATH, "DELETE");
  const deleteRole = async () => {
    let result = window.confirm(t("confirmRoleDelete"));
    if (result === true) {
      try {
        adminApi.deleteRole(id);
        fetchRoles();
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
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const canAddRole = usePermissions(adminApi.ROLES_PATH, "POST");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors([]);
      setSaving(true);
      await adminApi.createRole({ name, description });
      fetchRoles();
      alerts.showPopup(t("shared:success"), "success");
    } catch (err) {
      console.log(err);
      alerts.showErrors(err, setErrors);
    }
    setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
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
            {saving ? t("shared:saving") : t("shared:add")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export default RolesList;
