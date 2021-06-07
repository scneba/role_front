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
import Skeleton from "react-loading-skeleton";

export default function UserRoleList() {
  const { id } = useParams();
  const history = useHistory();
  const canView = usePermissions(adminApi.USERS_PATH);
  const [user, setUser] = useState({ roles: [] });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(
    async function () {
      try {
        setLoading(true);
        const resp = await adminApi.getSingleUser(id);
        console.log(resp.data);
        setUser(resp.data.data);
      } catch (e) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
      setLoading(false);
    },
    [id],
  );

  useEffect(() => {
    fetchUser();
  }, [id, history, fetchUser]);

  if (!canView) {
    return <Unauthorized />;
  }
  //show skeleton if still loading
  if (loading) {
    return <Skeleton height={40} count="4" className="m-3" />;
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

/**
 * Delete a user role from backend
 */
function DeleteUserRole({ userId, roleId, fetchUser }) {
  const { t } = useTranslation(["admin"]);
  const canDelete = usePermissions(adminApi.USERS_PATH, "DELETE");
  const deleteUserPermission = async () => {
    let result = window.confirm(t("confirmDelRole"));
    if (result === true) {
      var data = { role_id: roleId, user_id: userId };
      try {
        await adminApi.deleteUserRole(data);
        fetchUser();
        alerts.showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        alerts.showErrorsPopUp(err);
      }
    }
  };
  return (
    <Button onClick={deleteUserPermission} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

export function AssignRole({ user, fetchUser }) {
  const { t } = useTranslation(["admin"]);
  const [disableSave, setDisableSave] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [roles, setRoles] = useState(user.roles);
  const canAssign = usePermissions(adminApi.USERS_PATH, "POST");

  async function fetchRoles() {
    try {
      const resp = await adminApi.getRoles();
      setRoles(resp.data.data);
    } catch (err) {
      console.log(err);
      alerts.showErrorsPopUp(err);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  if (roles.length === 0) {
    return null;
  }
  var options = helpers.getUnassignedRoles(roles, user.roles);

  const assignRoles = async (e) => {
    e.preventDefault();
    if (!selectedOptions) {
      alerts.showPopup(t("noRoleAdded"));
      return;
    }
    let role_ids = helpers.getPermissionIds(selectedOptions);
    let result;
    if (role_ids.length === 1) {
      result = window.confirm(t("confirmAssignRole"));
    } else {
      result = window.confirm(t("confirmAssignRoles"));
    }
    if (result === true) {
      setDisableSave(true);
      var data = { id: user.id, roles: role_ids };
      try {
        await adminApi.updateUser(data);
        setSelectedOptions([]);
        fetchUser();
        alerts.showPopup(t("shared:success"), "success");
      } catch (err) {
        alerts.showErrorsPopUp(err);
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
              placeholder={t("selectRole")}
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              closeMenuOnSelect={false}
              options={options}
            />
          </Col>
          <Col>
            <Button
              disabled={disableSave || !canAssign}
              variant="danger"
              onClick={assignRoles}
            >
              {t("assignRoles")}
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
