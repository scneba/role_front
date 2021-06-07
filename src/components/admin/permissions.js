import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";
import { Table, Form, Col, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrors, showErrorsPopUp } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import Skeleton from "react-loading-skeleton";

export default function Permissions() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(adminApi.PERMISSION_PATH);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPermissions() {
    try {
      setLoading(true);
      const resp = await adminApi.getPermissions();
      setPermissions(
        resp.data.data.sort((a, b) => a.path.localeCompare(b.path)),
      );
    } catch (err) {
      console.log(err);
      showErrorsPopUp(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (!canView) {
    return <Unauthorized />;
  }
  //show skeleton if permissions are not yet loaded
  if (loading) {
    return <Skeleton height={40} count="4" className="m-3" />;
  }
  return (
    <React.Fragment>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon="user-tag" /> {t("permissions")}
      </h1>
      <CreatePermissionForm fetchPermissions={fetchPermissions} />
      <PermissionsTable
        permissions={permissions}
        fetchPermissions={fetchPermissions}
      />
    </React.Fragment>
  );
}

export function CreatePermissionForm({ fetchPermissions }) {
  const { t } = useTranslation(["admin", "shared"]);
  const [verb, setVerb] = useState("GET");
  const [path, setPath] = useState("");
  const canCreate = usePermissions(adminApi.PERMISSION_PATH, "POST");
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  if (!canCreate) {
    return <React.Fragment />;
  }

  const verbs = ["GET", "POST", "PATCH", "PUT", "DELETE"];

  const createPermission = async (e) => {
    e.preventDefault();
    var data = { verb, path };
    try {
      setErrors([]);
      setSaving(true);
      await adminApi.createPermission(data);
      fetchPermissions();
      showPopup(t("shared:success"), "success");
      setPath("");
      setVerb("GET");
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setSaving(false);
  };
  return (
    <Form className="mb-3" onSubmit={createPermission}>
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
      <Form.Row>
        <Col sm={3} lg={2}>
          <Form.Control
            as="select"
            name="verb"
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
          >
            {verbs.map((v, i) => {
              return (
                <option key={i} value={v}>
                  {v}
                </option>
              );
            })}
          </Form.Control>
        </Col>
        <Col sm={6} lg={4}>
          <Form.Control
            type="text"
            name="path"
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder={t("path")}
          />
        </Col>
        <Col>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ marginLeft: "auto" }}
          >
            {saving ? t("shared:saving") : t("addPerm")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export function PermissionsTable({ permissions, fetchPermissions }) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredPermissions, setFilteredPermissions] = useState(permissions);
  const canDelete = usePermissions(adminApi.PERMISSION_PATH, "DELETE");

  useEffect(() => {
    setFilteredPermissions(
      permissions.filter(
        (permission) =>
          permission.verb.toLowerCase().includes(search.toLowerCase()) ||
          permission.path.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, permissions]);

  return (
    <>
      <Row>
        <Col lg={7}>
          <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              name="Search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shared:search")}
            ></Form.Control>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("verb")}</th>
                <th>{t("path")}</th>
                <th>{t("shared:delete")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((permission) => (
                <PermissionsRow
                  permission={permission}
                  key={permission.id}
                  fetchPermissions={fetchPermissions}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
  function PermissionsRow({ permission, fetchPermissions }) {
    return (
      <tr>
        <td>{permission.verb}</td>
        <td>{permission.path}</td>
        <td>
          <DeletePermission
            id={permission.id}
            canDelete={canDelete}
            fetchPermissions={fetchPermissions}
          />
        </td>
      </tr>
    );
  }
}

function DeletePermission({ id, canDelete, fetchPermissions }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deletePermission = async () => {
    let result = window.confirm(t("confirmDel"));
    if (result === true) {
      try {
        await adminApi.deletePermission(id);
        fetchPermissions();
        showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
    }
  };

  return (
    <Button onClick={deletePermission} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}
