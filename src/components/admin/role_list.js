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

export default function RolePermissionsList() {
  const { id } = useParams();
  const history = useHistory();
  const canView = usePermissions(adminApi.PAGES_PATH);
  const [role, setRole] = useState({ users: [], permissions: [] });

  const fetchRole = useCallback(
    async function () {
      try {
        console.log(id);
        const resp = await adminApi.getSingleRole(id);
        console.log(resp.data);
        setRole(resp.data.data);
      } catch (e) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchRole();
  }, [id, history, fetchRole]);

  if (!canView) {
    return <Unauthorized />;
  }

  return <RolePermissions role={role} fetchRole={fetchRole} />;
}

export function RolePermissions({ role, fetchRole }) {
  const { t } = useTranslation(["admin"]);
  return (
    <div>
      <h1 className="mb-4 display-4 text-primary">{role.name}</h1>
      <AssignPermission role={role} fetchRole={fetchRole} />
      <Table response="sm" striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t("verb")}</th>
            <th>{t("path")}</th>
            <th>{t("delete")}</th>
          </tr>
        </thead>
        <tbody>
          {role.permissions.map((permission, i) => (
            <PermissionRow
              permission={permission}
              key={permission.id}
              roleId={role.id}
              fetchRole={fetchRole}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
function PermissionRow({ permission, roleId, fetchRole }) {
  return (
    <tr>
      <td>{permission.verb}</td>
      <td>{permission.path}</td>
      <td>
        <DeleteRolePermission
          roleId={roleId}
          permissionId={permission.id}
          fetchRole={fetchRole}
        />
      </td>
    </tr>
  );
}

function DeleteRolePermission({ roleId, permissionId, fetchRole }) {
  const { t } = useTranslation(["admin"]);
  const deletePermission = async () => {
    let result = window.confirm(t("confirmDel"));
    if (result === true) {
      var data = { role_id: roleId, permission_id: permissionId };
      try {
        await adminApi.deleteRolePermission(data);
        fetchRole();
        alert(t("shared:success"));
      } catch (e) {
        const msg = JSON.stringify(e);
        alerts.showPopup(msg);
      }
    }
  };
  return (
    <Button onClick={deletePermission}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

export function AssignPermission({ role, fetchRole }) {
  const { t } = useTranslation(["admin"]);
  const [disableSave, setDisableSave] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [permissions, setPermissions] = useState(role.permissions);

  async function fetchPermissions() {
    try {
      const resp = await adminApi.getPermissions();
      setPermissions(resp.data.data);
    } catch (err) {
      const msg = JSON.stringify(err);
      alerts.showPopup(msg);
    }
  }

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (permissions.length === 0) {
    return "Loading...";
  }
  var options = helpers.getUnassignedPermissions(permissions, role.permissions);

  const assignPermission = async (e) => {
    e.preventDefault();
    if (!selectedOptions) {
      alerts.showPopup("No permission to assign");
      return;
    }
    let permission_ids = helpers.getPermissionIds(selectedOptions);
    let result;
    if (permission_ids.length === 1) {
      result = window.confirm(t("confirmAssign"));
    } else {
      result = window.confirm(t("confirmAssigns"));
    }
    if (result === true) {
      setDisableSave(true);
      var data = { id: role.id, permissions: permission_ids };
      try {
        await adminApi.updateRole(data);
        setSelectedOptions([]);
        fetchRole();
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
              onClick={assignPermission}
            >
              {t("assignPermissions")}
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
