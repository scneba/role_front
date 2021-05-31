import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import * as adminApi from "../../services/admin";
import * as helpers from "../generics/helpers";
import { usePermissions, Unauthorized } from "../permissions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as alerts from "../generics/alerts";
import Select from "react-select";

export default function UserRoleList() {
  const { id } = useParams();
  const history = useHistory();
  const canView = usePermissions(adminApi.PAGES_PATH);
  const [user, setUser] = useState({ roles: [] });

  const fetchUser = useCallback(
    async function () {
      try {
        console.log(id);
        const resp = await adminApi.getSingleUser(id);
        console.log(resp.data);
        setUser(resp.data.data);
      } catch (e) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchUser();
  }, [id, history, fetchUser]);

  if (!canView) {
    return <Unauthorized />;
  }

  return <UserRoles user={user} fetchUser={fetchUser} />;
}

export function UserRoles({ user, fetchUser }) {
  const { t } = useTranslation(["admin"]);
  return (
    <div>
      <h1 className="mb-4 display-4 text-primary">{user.email}</h1>
      <AssignRole user={user} fetchUser={fetchUser} />
      <Table response="sm" striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("description")}</th>
            <th>{t("delete")}</th>
          </tr>
        </thead>
        <tbody>
          {user.roles.map((role, i) => (
            <RoleRow
              role={role}
              key={role.id}
              userId={user.id}
              fetchUser={fetchUser}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
function RoleRow({ role, userId, fetchUser }) {
  return (
    <tr>
      <td>{role.name}</td>
      <td>{role.description}</td>
      <td>
        <DeleteUserRole
          userId={userId}
          roleId={role.id}
          fetchUser={fetchUser}
        />
      </td>
    </tr>
  );
}

function DeleteUserRole({ userId, roleId, fetchUser }) {
  const { t } = useTranslation(["admin"]);
  const deleteUserPermission = async () => {
    let result = window.confirm(t("confirmDel"));
    if (result === true) {
      var data = { role_id: roleId, user_id: userId };
      try {
        await adminApi.deleteUserRole(data);
        fetchUser();
        alert(t("shared:success"));
      } catch (e) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
    }
  };
  return (
    <Button onClick={deleteUserPermission}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

export function AssignRole({ user, fetchUser }) {
  const { t } = useTranslation(["admin"]);
  const [disableSave, setDisableSave] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [roles, setRoles] = useState(user.roles);

  async function fetchRoles() {
    try {
      const resp = await adminApi.getRoles();
      setRoles(resp.data.data);
    } catch (err) {
      const msg = JSON.stringify(err);
      alerts.showPopup(msg);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  if (roles.length === 0) {
    return "Loading...";
  }
  var options = helpers.getUnassignedRoles(roles, user.roles);

  const assignRoles = async (e) => {
    e.preventDefault();
    if (!selectedOptions) {
      alerts.showPopup("No Roles to assign");
      return;
    }
    let role_ids = helpers.getPermissionIds(selectedOptions);
    let result;
    if (role_ids.length === 1) {
      result = window.confirm(t("confirmAssign"));
    } else {
      result = window.confirm(t("confirmAssigns"));
    }
    if (result === true) {
      setDisableSave(true);
      var data = { id: user.id, roles: role_ids };
      try {
        await adminApi.updateUser(data);
        setSelectedOptions([]);
        fetchUser();
        alert(t("shared:success"));
      } catch (err) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    setDisableSave(false);
  };

  return (
    <div>
      <Form className="mb-3">
        <Form.Row>
          <Col>
            <Select
              placeholder={t("defaultValue")}
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              closeMenuOnSelect={false}
              options={options}
            />
          </Col>
          <Col>
            <Button
              disabled={disableSave}
              variant="danger"
              onClick={assignRoles}
            >
              {t("assignPermissions")}
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
